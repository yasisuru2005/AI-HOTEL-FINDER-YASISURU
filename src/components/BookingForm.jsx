import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar, CalendarDays, Users } from "lucide-react";
import { useCreateBookingMutation } from "@/lib/api";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

const BookingForm = ({ hotel, onBookingCreated }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoaded } = useUser();

  const [createBooking] = useCreateBookingMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoaded) {
      toast.error("Please wait, loading user information...");
      return;
    }
    
    if (!user) {
      toast.error("Please sign in to make a booking");
      return;
    }
    
    if (!checkIn || !checkOut) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (new Date(checkIn) < new Date().toISOString().split('T')[0]) {
      toast.error("Check-in date cannot be in the past");
      return;
    }

    setIsLoading(true);
    try {
      const bookingData = {
        hotelId: hotel._id,
        checkIn,
        checkOut,
      };

      const result = await createBooking(bookingData).unwrap();
      toast.success("Booking created successfully!");
      onBookingCreated(result);
    } catch (error) {
      console.error("Booking creation failed:", error);
      toast.error(error?.data?.message || "Failed to create booking");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = checkOutDate - checkInDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * hotel.price;
  };

  return (
    <Card className="w-full max-w-md card-enhanced">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Calendar className="h-5 w-5 text-primary" />
          Book Your Stay
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkIn" className="text-sm font-medium">
                Check-in
              </label>
              <Input
                id="checkIn"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="checkOut" className="text-sm font-medium">
                Check-out
              </label>
              <Input
                id="checkOut"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="guests" className="text-sm font-medium">
              Guests
            </label>
            <div className="relative mt-1">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="guests"
                type="number"
                min="1"
                max="10"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                className="pl-10"
              />
            </div>
          </div>

          {checkIn && checkOut && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>${hotel.price} × {calculateNights()} nights</span>
                <span>${calculateTotal()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes & fees</span>
                <span>$0</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full btn-primary"
            disabled={isLoading || !checkIn || !checkOut}
          >
            {isLoading ? "Creating Booking..." : "Book Now"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;

