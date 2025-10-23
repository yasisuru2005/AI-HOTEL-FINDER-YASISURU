import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetUserBookingsQuery } from "@/lib/api";
import BookingCard from "@/components/BookingCard";
import { User, Calendar, CreditCard, Settings } from "lucide-react";
import { toast } from "sonner";

const MyAccountPage = () => {
  const { user, isLoaded } = useUser();
  const [userId, setUserId] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, paid

  // Set user ID for API calls
  useEffect(() => {
    if (isLoaded && user) {
      const id = user.id;
      setUserId(id);
      localStorage.setItem("userId", id);
    }
  }, [isLoaded, user]);

  const {
    data: bookingsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUserBookingsQuery(userId, {
    skip: !userId,
  });

  const bookings = bookingsData?.items || [];
  const totalBookings = bookingsData?.total || 0;

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.paymentStatus.toLowerCase() === filter;
  });

  if (!isLoaded) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your account</h1>
          <p className="text-muted-foreground">
            You need to be signed in to access your booking history and account settings.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-muted-foreground">
            Manage your bookings and account settings
          </p>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-lg">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.primaryEmailAddress?.emailAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member since</p>
                <p className="text-lg">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total bookings</p>
                <p className="text-lg font-semibold">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking History */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking History
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === "paid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("paid")}
                >
                  Paid
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <p className="text-destructive mb-4">
                  {error?.data?.message || "Failed to load bookings"}
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground mb-4">
                  {filter === "all"
                    ? "You haven't made any bookings yet."
                    : `No ${filter} bookings found.`}
                </p>
                {filter !== "all" && (
                  <Button onClick={() => setFilter("all")} variant="outline">
                    View All Bookings
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default MyAccountPage;

