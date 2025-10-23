import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { 
  X, 
  Star, 
  Wifi, 
  Car, 
  Dumbbell, 
  Utensils, 
  Waves,
  Mountain,
  Coffee,
  Tv,
  AirVent
} from "lucide-react";

const FilterSidebar = ({ 
  filters, 
  onFiltersChange, 
  hotels = [] 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Calculate price range from hotels data
  const priceRange = hotels.length > 0 ? {
    min: Math.min(...hotels.map(hotel => hotel.price)),
    max: Math.max(...hotels.map(hotel => hotel.price))
  } : { min: 0, max: 1000 };

  // Calculate rating range
  const ratingRange = hotels.length > 0 ? {
    min: Math.min(...hotels.map(hotel => hotel.rating || 0)),
    max: Math.max(...hotels.map(hotel => hotel.rating || 0))
  } : { min: 0, max: 5 };

  // Available amenities
  const availableAmenities = [
    { id: 'wifi', name: 'Free WiFi', icon: Wifi },
    { id: 'parking', name: 'Free Parking', icon: Car },
    { id: 'gym', name: 'Fitness Center', icon: Dumbbell },
    { id: 'restaurant', name: 'Restaurant', icon: Utensils },
    { id: 'pool', name: 'Swimming Pool', icon: Waves },
    { id: 'spa', name: 'Spa Services', icon: Mountain },
    { id: 'breakfast', name: 'Free Breakfast', icon: Coffee },
    { id: 'tv', name: 'Cable TV', icon: Tv },
    { id: 'ac', name: 'Air Conditioning', icon: AirVent },
  ];

  // Sort options
  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating-high', label: 'Rating: High to Low' },
    { value: 'rating-low', label: 'Rating: Low to High' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  // Update parent when local filters change
  useEffect(() => {
    onFiltersChange(localFilters);
  }, [localFilters, onFiltersChange]);

  const handlePriceChange = (value) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: value
    }));
  };

  const handleRatingChange = (value) => {
    setLocalFilters(prev => ({
      ...prev,
      ratingRange: value
    }));
  };

  const handleAmenityToggle = (amenityId) => {
    setLocalFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleSortChange = (sortBy) => {
    setLocalFilters(prev => ({
      ...prev,
      sortBy
    }));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      priceRange: [priceRange.min, priceRange.max],
      ratingRange: [ratingRange.min, ratingRange.max],
      amenities: [],
      starRating: [],
      sortBy: 'price-low'
    };
    setLocalFilters(clearedFilters);
  };

  const activeFiltersCount = 
    (localFilters.priceRange[0] > priceRange.min || localFilters.priceRange[1] < priceRange.max ? 1 : 0) +
    (localFilters.ratingRange[0] > ratingRange.min || localFilters.ratingRange[1] < ratingRange.max ? 1 : 0) +
    localFilters.amenities.length +
    (localFilters.sortBy !== 'price-low' ? 1 : 0);

  return (
    <div className="w-full md:w-80 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{activeFiltersCount} active</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${localFilters.priceRange[0]}</span>
              <span>${localFilters.priceRange[1]}</span>
            </div>
            <Slider
              value={localFilters.priceRange}
              onValueChange={handlePriceChange}
              min={priceRange.min}
              max={priceRange.max}
              step={10}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Rating Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Guest Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{localFilters.ratingRange[0].toFixed(1)} ⭐</span>
              <span>{localFilters.ratingRange[1].toFixed(1)} ⭐</span>
            </div>
            <Slider
              value={localFilters.ratingRange}
              onValueChange={handleRatingChange}
              min={ratingRange.min}
              max={ratingRange.max}
              step={0.1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Star Rating */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Star Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <label key={stars} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.starRating.includes(stars)}
                  onChange={(e) => {
                    setLocalFilters(prev => ({
                      ...prev,
                      starRating: e.target.checked
                        ? [...prev.starRating, stars]
                        : prev.starRating.filter(s => s !== stars)
                    }));
                  }}
                  className="rounded"
                />
                <div className="flex items-center">
                  {[...Array(stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm">{stars} stars</span>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {availableAmenities.map((amenity) => {
              const IconComponent = amenity.icon;
              return (
                <label key={amenity.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.amenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="rounded"
                  />
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{amenity.name}</span>
                </label>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={localFilters.sortBy === option.value}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="rounded"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSidebar;
