import { useState } from "react";
import { Star, MapPin, Wifi, Car, Dumbbell, Utensils, Waves, Mountain, Coffee, Tv, AirVent } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

const amenityIcons = {
  wifi: Wifi,
  parking: Car,
  gym: Dumbbell,
  restaurant: Utensils,
  pool: Waves,
  spa: Mountain,
  breakfast: Coffee,
  tv: Tv,
  ac: AirVent,
};

const EnhancedHotelCard = ({ hotel, onBookNow, onViewDetails }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Create multiple images for carousel (in real app, this would come from hotel data)
  const images = [
    hotel.image,
    "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308794596.jpg?k=76bbd047a4f3773844efb15819a637f10fb98671244760fcd69cf26d1073b797&o=&hp=1",
    "https://cf.bstatic.com/xdata/images/hotel/max1280x900/608273980.jpg?k=c7df20ffb25ae52b6a17037dc13f5e15b94a0fe253a9b9d0b656f6376eabec7d&o=&hp=1"
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Carousel */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-gray-900 flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {hotel.rating}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Hotel Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1">{hotel.name}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {hotel.location}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">{hotel.description}</p>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mt-3">
          {hotel.amenities?.slice(0, 4).map((amenity) => {
            const IconComponent = amenityIcons[amenity];
            return IconComponent ? (
              <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <IconComponent className="w-3 h-3" />
                <span className="capitalize">{amenity}</span>
              </div>
            ) : null;
          })}
          {hotel.amenities?.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{hotel.amenities.length - 4} more
            </Badge>
          )}
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mt-3">
          {renderStars(hotel.rating)}
          <span className="text-sm text-gray-600 ml-1">({hotel.rating})</span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-green-600">${hotel.price}</span>
            <span className="text-gray-600 text-sm">/night</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(hotel._id)}
            >
              View Details
            </Button>
            <Button
              size="sm"
              onClick={() => onBookNow(hotel._id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedHotelCard;

