import { useEffect, useState, useCallback } from "react";
import { useCreateCheckoutSessionMutation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

const StripeCheckout = ({ booking, onPaymentSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const createCheckoutSessionHandler = useCallback(async () => {
    if (!booking) return;

    setIsLoading(true);
    try {
      const result = await createCheckoutSession({
        bookingId: booking._id,
      }).unwrap();

      console.log("Checkout session result:", result);
      
      // Redirect to Stripe Checkout
      if (result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        toast.error("Payment session could not be created. Please try again.");
        onCancel();
      }
      
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("Failed to initialize payment. Please try again.");
      onCancel();
    } finally {
      setIsLoading(false);
    }
  }, [booking, createCheckoutSession, onCancel]);

  useEffect(() => {
    if (booking) {
      createCheckoutSessionHandler();
    }
  }, [booking, createCheckoutSessionHandler]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Redirecting to payment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Redirect
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Redirecting to secure payment...</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You will be redirected to Stripe's secure payment page.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => window.location.href = '/my-account'}
              className="flex-1"
            >
              View Bookings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeCheckout;

