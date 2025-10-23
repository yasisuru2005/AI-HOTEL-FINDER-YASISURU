import express from "express";
import isAuthenticated from "./middleware/authentication-middleware.js";
import { createCheckoutSession, handleStripeWebhook } from "../application/payment.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", isAuthenticated, createCheckoutSession);

// Stripe requires raw body for signature verification, so this route must be mounted with raw parser
paymentRouter.post("/webhook", handleStripeWebhook);

export default paymentRouter;



