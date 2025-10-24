import express from "express";
import isAuthenticated from "./middleware/authentication-middleware.js";
import { createBooking, getBookingById, getUserBookings, updateBookingStatus } from "../application/booking.js";

const bookingRouter = express.Router();

bookingRouter.post("/", isAuthenticated, createBooking);
bookingRouter.get("/user/:userId", isAuthenticated, getUserBookings);
bookingRouter.get("/:id", isAuthenticated, getBookingById);
bookingRouter.patch("/:id/status", isAuthenticated, updateBookingStatus);

export default bookingRouter;



