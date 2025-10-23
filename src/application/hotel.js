import Hotel from "../infrastructure/entities/Hotel.js";
import NotFoundError from "../domain/errors/not-found-error.js";
import ValidationError from "../domain/errors/validation-error.js";

export const getAllHotels = async (req, res, next) => {
  try {
    // Build dynamic query based on optional query params
    const {
      location,
      minPrice,
      maxPrice,
      ratingMin,
      ratingMax,
      amenities,
      q, // semantic-like text query
      sortBy,
      page,
      limit,
    } = req.query;

    const query = {};

    // Text search
    if (q && String(q).trim().length > 0) {
      // Prefer text index
      query.$text = { $search: String(q).trim() };
    } else {
      // Location contains match (case-insensitive)
      if (location && typeof location === "string") {
        query.location = { $regex: location, $options: "i" };
      }
    }

    // Price range
    const priceFilter = {};
    if (minPrice !== undefined && !Number.isNaN(Number(minPrice))) {
      priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && !Number.isNaN(Number(maxPrice))) {
      priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
      query.price = priceFilter;
    }

    // Rating range
    const ratingFilter = {};
    if (ratingMin !== undefined && !Number.isNaN(Number(ratingMin))) {
      ratingFilter.$gte = Number(ratingMin);
    }
    if (ratingMax !== undefined && !Number.isNaN(Number(ratingMax))) {
      ratingFilter.$lte = Number(ratingMax);
    }
    if (Object.keys(ratingFilter).length > 0) {
      query.rating = ratingFilter;
    }

    // Amenities filter: expects comma-separated values, e.g. amenities=wifi,pool
    if (amenities) {
      const list = String(amenities)
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      if (list.length > 0) {
        query.amenities = { $all: list };
      }
    }

    // Determine if any filtering/sorting/pagination is requested
    const hasQueryParams = Boolean(
      (location && location.length > 0) ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      ratingMin !== undefined ||
      ratingMax !== undefined ||
      (amenities && amenities.length > 0) ||
      (q && String(q).trim().length > 0) ||
      sortBy !== undefined ||
      page !== undefined ||
      limit !== undefined
    );

    // Pagination defaults
    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(limit) || 50));
    const skip = (pageNum - 1) * pageSize;

    // Sorting
    let sort = {};
    if (query.$text) {
      // If text search, sort by textScore
      sort = { score: { $meta: "textScore" } };
    } else {
      switch (sortBy) {
        case "price-low":
          sort = { price: 1 };
          break;
        case "price-high":
          sort = { price: -1 };
          break;
        case "rating-high":
          sort = { rating: -1 };
          break;
        case "rating-low":
          sort = { rating: 1 };
          break;
        case "name-asc":
          sort = { name: 1 };
          break;
        case "name-desc":
          sort = { name: -1 };
          break;
        default:
          sort = { _id: -1 };
      }
    }

    if (!hasQueryParams) {
      // Preserve original behavior when no query params are provided
      const hotels = await Hotel.find();
      res.status(200).json(hotels);
    } else {
      // Return paginated and sorted results when query params are present
      const findQuery = Hotel.find(query);
      if (query.$text) {
        findQuery.select({ score: { $meta: "textScore" } });
      }
      const [items, total] = await Promise.all([
        findQuery.sort(sort).skip(skip).limit(pageSize),
        Hotel.countDocuments(query),
      ]);
      res.status(200).json({ items, total, page: pageNum, limit: pageSize });
    }
    return;
  } catch (error) {
    next(error);
  }
};

export const createHotel = async (req, res, next) => {
  try {
    const hotelData = req.body;
    if (
      !hotelData.name ||
      !hotelData.image ||
      !hotelData.location ||
      !hotelData.price ||
      !hotelData.description
    ) {
      throw new ValidationError("Invalid hotel data");
    }
    await Hotel.create(hotelData);
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

export const getHotelById = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const hotelData = req.body;
    if (
      !hotelData.name ||
      !hotelData.image ||
      !hotelData.location ||
      !hotelData.price ||
      !hotelData.description
    ) {
      throw new ValidationError("Invalid hotel data");
    }

    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }

    await Hotel.findByIdAndUpdate(_id, hotelData);
    res.status(200).json(hotelData);
  } catch (error) {
    next(error);
  }
};

export const patchHotel = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const hotelData = req.body;
    if (!hotelData.price) {
      throw new ValidationError("Price is required");
    }
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    await Hotel.findByIdAndUpdate(_id, { price: hotelData.price });
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const hotel = await Hotel.findById(_id);
    if (!hotel) {
      throw new NotFoundError("Hotel not found");
    }
    await Hotel.findByIdAndDelete(_id);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
