import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useGetCheckoutSessionQuery } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const PaymentReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const [paymentStatus, setPaymentStatus] = useState("loading");

  const { data: session, error, isLoading } = useGetCheckoutSessionQuery(sessionId, {
    skip: !sessionId,
  });

  useEffect(() => {
    if (!sessionId) {
      setPaymentStatus("error");
      return;
    }

    if (session) {
      if (session.payment_status === "paid" || session.status === "complete") {
        setPaymentStatus("success");
        // Redirect after 3 seconds
        setTimeout(() => navigate("/my-account"), 3000);
      } else {
        setPaymentStatus("error");
      }
    }

    if (error) {
      setPaymentStatus("error");
    }
  }, [session, error, sessionId, navigate]);

  if (isLoading || paymentStatus === "loading") {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h2 className="text-xl font-semibold">Verifying payment...</h2>
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we confirm your payment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">
              Your booking has been confirmed and payment was successful.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Redirecting you to your account...
            </p>
            <Button onClick={() => navigate("/my-account")} className="w-full">
              View My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="h-6 w-6" />
            Payment Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            There was an issue processing your payment.
          </p>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/my-account")} variant="outline" className="flex-1">
              View Bookings
            </Button>
            <Button onClick={() => navigate("/hotels")} className="flex-1">
              Browse Hotels
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentReturnPage;

