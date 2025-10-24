import "dotenv/config";
import Stripe from "stripe";
import Booking from "../infrastructure/entities/Booking.js";
import Hotel from "../infrastructure/entities/Hotel.js";
import ValidationError from "../domain/errors/validation-error.js";
import NotFoundError from "../domain/errors/not-found-error.js";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

/**
 * POST /api/payments/create-checkout-session
 * Body: { bookingId: string }
 * Returns: { client_secret, session_id }
 */
export const createCheckoutSession = async (req, res, next) => {
  try {
    if (!stripe) return res.status(503).json({ message: "Payment service not configured" });

    const { bookingId } = req.body;
    if (!bookingId) throw new ValidationError("bookingId is required");

    const booking = await Booking.findById(bookingId).populate({
      path: "hotelId",
      model: Hotel,
    });
    if (!booking) throw new NotFoundError("Booking not found");

    // Ensure the booking belongs to the authenticated user
    if (String(booking.userId) !== String(req.auth().userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const hotel = booking.hotelId;
    if (!hotel) throw new NotFoundError("Hotel not found for this booking");

    // Validate amount & currency
    const humanAmount = Number(booking.amountTotal);
    if (!Number.isFinite(humanAmount) || humanAmount <= 0) {
      throw new ValidationError("Invalid booking amount");
    }
    const unitAmount = Math.round(humanAmount * 100);
    const currency = String(booking.currency || "usd").toLowerCase();

    // Stripe only accepts absolute URLs for images
    const productImage =
      hotel.image && /^https?:\/\//i.test(hotel.image) ? hotel.image : undefined;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        ui_mode: "embedded", // Embedded Checkout flow
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: hotel.name || "Hotel booking",
                ...(productImage ? { images: [productImage] } : {}),
              },
              unit_amount: unitAmount,
            },
            quantity: 1,
          },
        ],
        metadata: {
          bookingId: String(booking._id),
          userId: String(booking.userId),
          hotelId: String(hotel._id),
        },
        // Embedded Checkout uses return_url (not success_url/cancel_url)
        return_url: `${process.env.CLIENT_URL}/payment/return?session_id={CHECKOUT_SESSION_ID}`,
      },
      {
        // Prevent duplicate sessions for the same booking from rapid clicks
        idempotencyKey: `checkout_${booking._id}`,
      }
    );

    return res.status(200).json({
      client_secret: session.client_secret,
      session_id: session.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payments/webhook
 * IMPORTANT: Mount this route with express.raw({ type: "application/json" })
 * BEFORE express.json() and outside any auth middleware.
 */
export const handleStripeWebhook = async (req, res) => {
  if (!stripe) return res.status(503).json({ message: "Payment service not configured" });

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // req.body is a Buffer here because of express.raw()
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session?.metadata?.bookingId;

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "PAID" });
      }
    }

    return res.json({ received: true });
  } catch (error) {
    return res.status(500).send();
  }
};

export const getCheckoutSession = async (req, res, next) => {
  try {
    if (!stripe) return res.status(503).json({ message: "Payment service not configured" });
    const { id } = req.params; // Checkout Session id from query
    const s = await stripe.checkout.sessions.retrieve(id);

    return res.json({
      id: s.id,
      payment_status: s.payment_status,          // 'paid' when done
      status: s.status,                          // 'complete' when done
      mode: s.mode,
      ui_mode: s.ui_mode,
      metadata: s.metadata || {},                // contains bookingId, hotelId you set
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createCheckoutSession,
  handleStripeWebhook,
};