import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  reviews: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Review",
    default: [],
  },
  amenities: {
    type: [String],
    default: [],
    index: true,
  },
});

// Text index for semantic-like search
hotelSchema.index(
  { name: "text", description: "text", location: "text", amenities: "text" },
  { weights: { name: 5, description: 3, location: 2, amenities: 1 } }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
