import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useGetBookingByIdQuery } from "@/lib/api";
import StripeCheckout from "@/components/StripeCheckout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");

  const { data: booking, isLoading, isError } = useGetBookingByIdQuery(bookingId, {
    skip: !bookingId,
  });

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-xl font-semibold">No Booking Found</h2>
            <p className="text-muted-foreground">
              Please create a booking first before proceeding to payment.
            </p>
            <Button onClick={() => navigate("/hotels")}>Browse Hotels</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <h2 className="text-xl font-semibold">Booking Not Found</h2>
            <p className="text-muted-foreground">
              We couldn't find the booking you're looking for.
            </p>
            <Button onClick={() => navigate("/my-account")}>View My Bookings</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Complete Your Payment</h1>
        <StripeCheckout booking={booking} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default PaymentPage;

