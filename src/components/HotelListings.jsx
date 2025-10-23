import HotelCard from "@/components/HotelCard";
import FilterSidebar from "@/components/FilterSidebar";
import {
  useGetAllHotelsQuery,
  useGetAllLocationsQuery,
  useAddLocationMutation,
} from "@/lib/api";
import { Skeleton } from "./ui/skeleton";
import { useState, useMemo, useEffect, useCallback } from "react";
import LocationTab from "./LocationTab";
import { Button } from "./ui/button";
import { PlusCircle, Filter, X, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { clearSearch } from "@/lib/features/searchSlice";
import { Link } from "react-router";

function HotelListings() {
  const dispatch = useDispatch();
  const searchMode = useSelector((s) => s.search.searchMode);
  const searchQuery = useSelector((s) => s.search.query);

  const [selectedLocation, setSelectedLocation] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [filters, setFilters] = useState({
    priceRange: [160, 350],
    ratingRange: [0, 5],
    amenities: [],
    starRating: [],
    sortBy: 'price-low'
  });

  const {
    data: locations,
    isLoading: isLocationsLoading,
    isError: isLocationsError,
    error: locationsError,
  } = useGetAllLocationsQuery();

  const [
    addLocation,
    {
      isLoading: isAddLocationLoading,
    },
  ] = useAddLocationMutation();

  const allLocations = locations
    ? [{ _id: 0, name: "All" }, ...locations]
    : [{ _id: 0, name: "All" }];

  const selectedLocationName = allLocations.find(
    (el) => selectedLocation === el._id
  ).name;

  // Build query params for backend
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      sortBy: filters.sortBy,
      minPrice: filters.priceRange?.[0],
      maxPrice: filters.priceRange?.[1],
      ratingMin: filters.ratingRange?.[0],
      ratingMax: filters.ratingRange?.[1],
    };
    if (selectedLocation !== 0 && selectedLocationName) {
      params.location = selectedLocationName;
    }
    if (filters.amenities && filters.amenities.length > 0) {
      params.amenities = filters.amenities.join(',');
    }
    // Simple server-side search: pass query as location contains if in search mode
    if (searchMode && searchQuery) {
      params.location = searchQuery;
    }
    return params;
  }, [page, limit, filters, selectedLocation, selectedLocationName, searchMode, searchQuery]);

  // Fetch hotels with params
  const {
    data: hotelsResponse,
    isLoading: isHotelsLoading,
    isError: isHotelsError,
    error: hotelsError,
  } = useGetAllHotelsQuery(queryParams);

  // Normalize data whether array or paginated object
  const { items: hotels = [], total = 0 } = useMemo(() => {
    if (!hotelsResponse) return { items: [], total: 0 };
    if (Array.isArray(hotelsResponse)) {
      return { items: hotelsResponse, total: hotelsResponse.length };
    }
    return {
      items: hotelsResponse.items || [],
      total: hotelsResponse.total || 0,
    };
  }, [hotelsResponse]);

  // Reset to first page when filters or location or search changes
  useEffect(() => {
    setPage(1);
  }, [filters, selectedLocation, searchMode, searchQuery]);

  // ESC to clear search
  const onKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && searchMode) {
      dispatch(clearSearch());
    }
  }, [dispatch, searchMode]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));

  const isLoading = isHotelsLoading || isLocationsLoading;
  const isError = isHotelsError || isLocationsError;

  const handleLocationSelect = (selectedLocationItem) => {
    setSelectedLocation(selectedLocationItem._id);
  };

  const handleAddLocation = async () => {
    try {
      toast.loading("Adding location...");
      await addLocation({ name: "Fiji" }).unwrap();
      toast.success("Location added successfully");
    } catch {
      toast.error("Failed to add location");
    }
  };

  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      priceRange: [160, 350],
      ratingRange: [0, 5],
      amenities: [],
      starRating: [],
      sortBy: 'price-low'
    });
  }, []);

  if (isLoading) {
    return (
      <section className="px-4 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Top Trending Hotels
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover the most trending hotels worldwide for an unforgettable
              experience. From luxury resorts to boutique stays.
            </p>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-3 mb-12">
            <Skeleton className="h-10 w-20 rounded-full" />
            <Skeleton className="h-10 w-16 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-18 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="px-4 py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Top Trending Hotels
              </span>
            </h2>
          </div>
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 max-w-md mx-auto">
            <p className="text-destructive text-lg font-medium">Error loading hotels</p>
            <p className="text-muted-foreground mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 lg:py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Top Trending Hotels
            </span>
          </h2>
          
          {/* Centered Location Tabs */}
          {!searchMode && (
            <div className="flex items-center justify-center flex-wrap gap-3 mb-6">
              {allLocations.map((location) => {
                return (
                  <LocationTab
                    onClick={handleLocationSelect}
                    location={location}
                    selectedLocation={selectedLocation}
                    key={location._id}
                  />
                );
              })}
            </div>
          )}

          {/* View toggle */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="flex items-center gap-2"
            >
              <LayoutGrid className="w-4 h-4" /> Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2"
            >
              <List className="w-4 h-4" /> List
            </Button>
            {searchMode && (
              <Button variant="outline" size="sm" onClick={() => dispatch(clearSearch())}>
                Clear Search (Esc)
              </Button>
            )}
          </div>
          
          {/* Add Location Button (for testing) */}
          {!searchMode && (
            <Button
              disabled={isAddLocationLoading}
              variant="outline"
              className={`${isAddLocationLoading ? "opacity-50" : ""} mb-8`}
              onClick={handleAddLocation}
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add Test Location
            </Button>
          )}
        </div>

        {/* Filter Toggle Button */}
        {!searchMode && (
          <div className="flex justify-center mb-6">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          {!searchMode && showFilters && (
            <div className="lg:w-80">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                hotels={hotels}
              />
            </div>
          )}

          {/* Hotel List */}
          <div className="flex-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hotels.map((hotel) => (
                  <HotelCard key={hotel._id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {hotels.map((hotel) => (
                  <div key={hotel._id} className="border rounded-xl p-4 flex gap-4">
                    <div className="w-40 h-28 overflow-hidden rounded-lg shrink-0">
                      <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{hotel.name}</h3>
                        <span className="text-sm text-muted-foreground">{hotel.location}</span>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {hotel.description}
                      </div>
                        <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">${hotel.price}</span> / night · {hotel.rating || 0}⭐
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/hotels/${hotel._id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {hotels.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
                  <p className="text-sm">Try adjusting your filters to see more results.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={searchMode ? () => dispatch(clearSearch()) : handleClearFilters}
                  className="mt-4"
                >
                  {searchMode ? 'Clear Search' : 'Clear All Filters'}
                </Button>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HotelListings;
