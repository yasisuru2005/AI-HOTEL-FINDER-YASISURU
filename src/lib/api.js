import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getAllHotels = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    const res = await fetch(`${apiUrl}/hotels`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch hotels");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllLocations = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    const res = await fetch(`${apiUrl}/locations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch locations");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { getAllHotels, getAllLocations };

// Mock data for development
const mockHotels = [
  {
    _id: "1",
    name: "Montmartre Majesty Hotel",
    description: "Experience the charm of Montmartre with this luxurious hotel. Enjoy stunning views of the city and the Eiffel Tower from your room.",
    image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1",
    location: "Paris, France",
    rating: 4.7,
    price: 160,
    reviews: []
  },
  {
    _id: "2",
    name: "Loire Luxury Lodge",
    description: "Experience the beauty of the Loire Valley with this luxurious hotel. Enjoy stunning views of the vineyards and the Loire River from your room.",
    image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1",
    location: "Sydney, Australia",
    rating: 4.7,
    price: 200,
    reviews: []
  },
  {
    _id: "3",
    name: "Tokyo Tower Inn",
    description: "Experience the beauty of Tokyo with this luxurious hotel. Enjoy stunning views of the city and the Tokyo Tower from your room.",
    image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1",
    location: "Tokyo, Japan",
    rating: 4.4,
    price: 250,
    reviews: []
  },
  {
    _id: "4",
    name: "Sydney Harbor Hotel",
    description: "Experience the beauty of Sydney with this luxurious hotel. Enjoy stunning views of the city and the Sydney Harbor from your room.",
    image: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1",
    location: "Sydney, Australia",
    rating: 4.8,
    price: 300,
    reviews: []
  }
];

const mockLocations = [
  { _id: "1", name: "France" },
  { _id: "2", name: "Australia" },
  { _id: "3", name: "Japan" }
];

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api/",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");
      // Add user ID header for authentication
      const userId = localStorage.getItem("userId");
      console.log("API request - User ID from localStorage:", userId);
      if (userId) {
        headers.set("x-user-id", userId);
        console.log("Added x-user-id header:", userId);
      } else {
        console.log("No user ID found - request will fail authentication");
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    getAllHotels: build.query({
      // params: { location, minPrice, maxPrice, ratingMin, ratingMax, amenities, sortBy, page, limit }
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return;
          // Arrays are joined as comma-separated (e.g., amenities)
          if (Array.isArray(value)) {
            if (value.length > 0) searchParams.set(key, value.join(","));
          } else {
            searchParams.set(key, String(value));
          }
        });
        const qs = searchParams.toString();
        return `hotels${qs ? `?${qs}` : ""}`;
      },
      // Fallback to mock data if API fails
      async queryFn(arg, api, extraOptions, baseQuery) {
        try {
          const url = (() => {
            const searchParams = new URLSearchParams();
            if (arg && typeof arg === "object") {
              Object.entries(arg).forEach(([key, value]) => {
                if (value === undefined || value === null || value === "") return;
                if (Array.isArray(value)) {
                  if (value.length > 0) searchParams.set(key, value.join(","));
                } else {
                  searchParams.set(key, String(value));
                }
              });
            }
            const qs = searchParams.toString();
            return `hotels${qs ? `?${qs}` : ""}`;
          })();
          const result = await baseQuery(url, api, extraOptions);
          if (result.error) {
            console.warn("API failed, using mock data:", result.error);
            return { data: mockHotels };
          }
          return result;
        } catch (error) {
          console.warn("API failed, using mock data:", error);
          return { data: mockHotels };
        }
      },
    }),
    getHotelById: build.query({
      query: (id) => `hotels/${id}`,
    }),
    addLocation: build.mutation({
      query: (location) => ({
        url: "locations",
        method: "POST",
        body: location,
      }),
    }),
    getAllLocations: build.query({
      query: () => "locations",
      // Fallback to mock data if API fails
      async queryFn(arg, api, extraOptions, baseQuery) {
        try {
          const result = await baseQuery("locations", api, extraOptions);
          if (result.error) {
            console.warn("API failed, using mock data:", result.error);
            return { data: mockLocations };
          }
          return result;
        } catch (error) {
          console.warn("API failed, using mock data:", error);
          return { data: mockLocations };
        }
      },
    }),
    // Booking endpoints
    createBooking: build.mutation({
      query: (bookingData) => ({
        url: "bookings",
        method: "POST",
        body: bookingData,
      }),
    }),
    getUserBookings: build.query({
      query: (userId) => `bookings/user/${userId}`,
    }),
    getBookingById: build.query({
      query: (bookingId) => `bookings/${bookingId}`,
    }),
    // Payment endpoints
    createCheckoutSession: build.mutation({
      query: (sessionData) => ({
        url: "payments/create-checkout-session",
        method: "POST",
        body: sessionData,
      }),
    }),
  }),
});

export const {
  useGetAllHotelsQuery,
  useGetHotelByIdQuery,
  useAddLocationMutation,
  useGetAllLocationsQuery,
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  useGetBookingByIdQuery,
  useCreateCheckoutSessionMutation,
} = api;
