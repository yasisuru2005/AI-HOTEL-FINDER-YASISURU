import express from "express";
import isAuthenticated from "./middleware/authentication-middleware.js";
import {
  createCheckoutSession,
  getCheckoutSession,
} from "../application/payment.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout-session", isAuthenticated, createCheckoutSession);
paymentRouter.get("/session/:id", isAuthenticated, getCheckoutSession); // used by /payment/return

export default paymentRouter;