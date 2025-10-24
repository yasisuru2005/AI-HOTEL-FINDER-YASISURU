import express from "express";
import isAuthenticated from "./middleware/authentication-middleware.js";
import {
  createCheckoutSession,
  getCheckoutSession,
  handleStripeWebhook,
} from "../application/payment.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", isAuthenticated, createCheckoutSession);
paymentRouter.post("/webhook", handleStripeWebhook); // NO auth middleware for webhooks
paymentRouter.get("/session/:id", isAuthenticated, getCheckoutSession);

export default paymentRouter;