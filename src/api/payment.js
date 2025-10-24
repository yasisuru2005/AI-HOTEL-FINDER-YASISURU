import express from "express";
import express from "express";
import isAuthenticated from "./middleware/authentication-middleware.js";
import {
  createCheckoutSession,
  handleStripeWebhook,
  getCheckoutSession,       // ⬅️ add this import
} from "../application/payment.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", isAuthenticated, createCheckoutSession);
// Do NOT mount the webhook here with json parsing; in server entry you already mounted raw.
paymentRouter.get("/session/:id", isAuthenticated, getCheckoutSession);  // ⬅️ add this

export default paymentRouter;


