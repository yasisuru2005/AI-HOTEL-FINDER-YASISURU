import "dotenv/config";

import express from "express";
import cors from "cors";

import hotelsRouter from "./api/hotel.js";
import connectDB from "./infrastructure/db.js";
import reviewRouter from "./api/review.js";
import locationsRouter from "./api/location.js";
import bookingRouter from "./api/booking.js";
import paymentRouter, { handleStripeWebhook } from "./api/payment.js"; // updated import
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware.js";

import { clerkMiddleware } from "@clerk/express";

const app = express();

/** 
 * 1) Stripe webhook FIRST — must use raw body and skip auth
 */
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

/**
 * 2) Normal middleware
 */
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean),
  })
);
app.use(express.json());
app.use(clerkMiddleware());

/**
 * 3) Routers
 */
app.use("/api/hotels", hotelsRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);

app.use(globalErrorHandlingMiddleware);

connectDB();

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Server is listening on PORT:", PORT);
});