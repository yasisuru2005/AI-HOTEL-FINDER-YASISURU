import Booking from "../infrastructure/entities/Booking.js";
import Hotel from "../infrastructure/entities/Hotel.js";
import ValidationError from "../domain/errors/validation-error.js";
import NotFoundError from "../domain/errors/not-found-error.js";

const generateRoomNumber = async (hotelId, checkIn, checkOut) => {
  // naive unique room number generator per date range and hotel
  // in real systems, you'd manage inventory; here we just pick next available number up to 9999
  const existing = await Booking.find({ hotelId, checkIn, checkOut })
    .select("roomNumber")
    .lean();
  const used = new Set(existing.map((b) => b.roomNumber));
  for (let candidate = 100; candidate < 10000; candidate += 1) {
    if (!used.has(candidate)) return candidate;
  }
  throw new ValidationError("No rooms available for selected dates");
};

export const createBooking = async (req, res, next) => {
  try {
    const userId = req.auth().userId;
    const { hotelId, checkIn, checkOut } = req.body;

    if (!hotelId || !checkIn || !checkOut) {
      throw new ValidationError("hotelId, checkIn, and checkOut are required");
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) throw new NotFoundError("Hotel not found");

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (!(checkInDate < checkOutDate)) {
      throw new ValidationError("checkIn must be before checkOut");
    }

    const roomNumber = await generateRoomNumber(hotelId, checkInDate, checkOutDate);

    const numNights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const amountTotal = hotel.price * Math.max(1, numNights);

    const booking = await Booking.create({
      userId,
      hotelId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      roomNumber,
      amountTotal,
      currency: "usd",
      paymentStatus: "PENDING",
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const authUserId = req.auth().userId;
    if (userId !== authUserId) {
      // do not leak others' bookings
      return res.status(403).json({ message: "Forbidden" });
    }
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Booking.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate({ path: "hotelId", model: Hotel }),
      Booking.countDocuments({ userId }),
    ]);
    res.status(200).json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate({ path: "hotelId", model: Hotel });
    if (!booking) throw new NotFoundError("Booking not found");
    if (booking.userId !== req.auth().userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    
    if (!paymentStatus || !["PENDING", "PAID", "CANCELLED"].includes(paymentStatus)) {
      throw new ValidationError("Invalid payment status");
    }
    
    const booking = await Booking.findById(id);
    if (!booking) throw new NotFoundError("Booking not found");
    
    if (booking.userId !== req.auth().userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    booking.paymentStatus = paymentStatus;
    await booking.save();
    
    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
};



