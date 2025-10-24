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

    // Stripe only accepts absolute image URLs
    const productImage =
      hotel.image && /^https?:\/\//i.test(hotel.image) ? hotel.image : undefined;

    const sessionMetadata = {
      bookingId: String(booking._id),
      userId: String(booking.userId),
      hotelId: String(hotel._id),
    };
    
    console.log("Creating Stripe session with metadata:", sessionMetadata);

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        ui_mode: "embedded", // Embedded Checkout
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
        metadata: sessionMetadata,
        // Keep a return hub so we can reliably redirect using session metadata
        return_url: `${process.env.CLIENT_URL}/payment/return?session_id={CHECKOUT_SESSION_ID}`,
      },
      {
        idempotencyKey: `checkout_${booking._id}`, // avoid dup sessions
      }
    );

    console.log("Stripe session created:", session.id);
    console.log("Session metadata saved:", session.metadata);

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
 * IMPORTANT: Must be mounted with express.raw({ type: "application/json" })
 * BEFORE express.json() and outside any auth middleware.
 */
export const handleStripeWebhook = async (req, res) => {
  console.log("=== STRIPE WEBHOOK RECEIVED ===");
  
  if (!stripe) {
    console.error("Stripe not configured!");
    return res.status(503).json({ message: "Payment service not configured" });
  }

  const sig = req.headers["stripe-signature"];
  console.log("Webhook signature present:", !!sig);
  
  let event;

  try {
    // req.body is a Buffer here because of express.raw() on this route
    console.log("Request body type:", typeof req.body);
    console.log("Request body is Buffer:", Buffer.isBuffer(req.body));
    
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("Webhook event constructed successfully:", event.type);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    console.log("Processing event type:", event.type);
    
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session?.metadata?.bookingId;
      
      console.log("Checkout session completed!");
      console.log("Session ID:", session.id);
      console.log("Payment status:", session.payment_status);
      console.log("Booking ID from metadata:", bookingId);
      
      if (bookingId) {
        const result = await Booking.findByIdAndUpdate(
          bookingId, 
          { paymentStatus: "PAID" },
          { new: true }
        );
        console.log("Booking updated successfully:", result?._id);
        console.log("New payment status:", result?.paymentStatus);
      } else {
        console.error("No booking ID in metadata!");
      }
    }
    
    console.log("=== WEBHOOK PROCESSED SUCCESSFULLY ===");
    return res.json({ received: true });
  } catch (error) {
    console.error("=== WEBHOOK PROCESSING ERROR ===");
    console.error("Error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).send();
  }
};

/**
 * GET /api/payments/session/:id
 * Used by /payment/return page to look up hotelId/bookingId for redirect.
 */
export const getCheckoutSession = async (req, res, next) => {
  try {
    if (!stripe) return res.status(503).json({ message: "Payment service not configured" });
    const { id } = req.params;
    const s = await stripe.checkout.sessions.retrieve(id);
    return res.json({
      id: s.id,
      payment_status: s.payment_status, // 'paid'
      status: s.status,                 // 'complete'
      metadata: s.metadata || {},       // contains bookingId, hotelId
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createCheckoutSession,
  handleStripeWebhook,
  getCheckoutSession,
};