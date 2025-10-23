import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/infrastructure/db.js";
import hotelsRouter from "./src/api/hotel.js";
import locationsRouter from "./src/api/location.js";
import reviewsRouter from "./src/api/review.js";
import bookingRouter from "./src/api/booking.js";
import paymentRouter from "./src/api/payment.js";
import globalErrorHandlingMiddleware from "./src/api/middleware/global-error-handling-middleware.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
// Stripe webhook requires raw body; mount raw parser specifically before JSON parser
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body; // expose for signature verification
    next();
  }
);
app.use(express.json());

// Routes
app.use("/api/hotels", hotelsRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Hotel Finder API is running!", status: "healthy" });
});

// Global error handling middleware
app.use(globalErrorHandlingMiddleware);

// 404 handler - handle all unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
      console.log(`🏨 Hotels API: http://localhost:${PORT}/api/hotels`);
      console.log(`📍 Locations API: http://localhost:${PORT}/api/locations`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
