import "dotenv/config";
import Stripe from "stripe";
import Booking from "../infrastructure/entities/Booking.js";
import Hotel from "../infrastructure/entities/Hotel.js";
import ValidationError from "../domain/errors/validation-error.js";
import NotFoundError from "../domain/errors/not-found-error.js";

// Only initialize Stripe if API key is provided
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export const createCheckoutSession = async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(503).json({ message: "Payment service not configured" });
    }

    const { bookingId } = req.body;
    if (!bookingId) throw new ValidationError("bookingId is required");

    const booking = await Booking.findById(bookingId).populate({ path: "hotelId", model: Hotel });
    if (!booking) throw new NotFoundError("Booking not found");
    if (booking.userId !== req.auth().userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const hotel = booking.hotelId;
    const amount = Math.round(Number(booking.amountTotal) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: booking.currency || "usd",
            product_data: {
              name: hotel.name,
              images: hotel.image ? [hotel.image] : [],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(),
        userId: booking.userId,
        hotelId: hotel._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/my-account?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/hotels/${hotel._id}?payment=cancelled`,
    });

    console.log("Stripe session created:", {
      sessionId: session.id,
      clientSecret: session.client_secret,
      clientSecretType: typeof session.client_secret,
      clientSecretLength: session.client_secret?.length
    });
    
    res.status(200).json({ 
      checkout_url: session.url, 
      session_id: session.id,
      client_secret: session.client_secret 
    });
  } catch (error) {
    next(error);
  }
};

export const handleStripeWebhook = async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ message: "Payment service not configured" });
  }

  // Raw body is required by Stripe.
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = new Stripe.Webhook(process.env.STRIPE_WEBHOOK_SECRET).constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { bookingId } = session.metadata || {};
      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "PAID" });
      }
    }
    res.json({ received: true });
  } catch (error) {
    res.status(500).send();
  }
};



