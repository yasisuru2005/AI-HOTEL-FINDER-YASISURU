import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, CreditCard, User } from "lucide-react";
import { format } from "date-fns";

const BookingCard = ({ booking }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="w-full card-enhanced">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{booking.hotelId?.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {booking.hotelId?.location}
            </div>
          </div>
          <Badge className={getStatusColor(booking.paymentStatus)}>
            {booking.paymentStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <p className="font-medium">Check-in</p>
              <p className="text-muted-foreground">{formatDate(booking.checkIn)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <div>
              <p className="font-medium">Check-out</p>
              <p className="text-muted-foreground">{formatDate(booking.checkOut)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Room Number</p>
            <p className="text-muted-foreground">#{booking.roomNumber}</p>
          </div>
          <div>
            <p className="font-medium">Total Amount</p>
            <p className="text-muted-foreground">{formatCurrency(booking.amountTotal)}</p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Booked on {formatDate(booking.createdAt)}</p>
        </div>

        {booking.hotelId?.image && (
          <div className="mt-3">
            <img
              src={booking.hotelId.image}
              alt={booking.hotelId.name}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;

