import express from "express";
import isAuthenticated from "./middleware/authentication-middleware.js";
import {
  createCheckoutSession,
  getCheckoutSession,
} from "../application/payment.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", isAuthenticated, createCheckoutSession);
// NOTE: Webhook route is registered directly in index.js with raw body parser
paymentRouter.get("/session/:id", isAuthenticated, getCheckoutSession);

export default paymentRouter;