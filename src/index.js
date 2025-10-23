import "dotenv/config";

import express from "express";
import cors from "cors";

import hotelsRouter from "./api/hotel.js";
import connectDB from "./infrastructure/db.js";
import reviewRouter from "./api/review.js";
import locationsRouter from "./api/location.js";
import bookingRouter from "./api/booking.js";
import paymentRouter from "./api/payment.js";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware.js";

import { clerkMiddleware } from "@clerk/express";

const app = express();

// Convert HTTP payloads into JS objects
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ].filter(Boolean),
  })
);
app.use(clerkMiddleware()); // Reads the JWT from the request and sets the auth object on the request

// app.use((req, res, next) => {
//   console.log(req.method, req.url);
//   next();
// });

app.use("/api/hotels", hotelsRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);

app.use(globalErrorHandlingMiddleware);

connectDB();

const PORT = 8000;
app.listen(PORT, () => {
  console.log("Server is listening on PORT: ", PORT);
});
