import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { useCreateCheckoutSessionMutation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripeCheckout = ({ booking, onPaymentSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  useEffect(() => {
    if (booking) {
      createCheckoutSessionHandler();
    }
  }, [booking]);

  const createCheckoutSessionHandler = async () => {
    if (!booking) return;

    setIsLoading(true);
    try {
      const result = await createCheckoutSession({
        bookingId: booking._id,
      }).unwrap();

      setClientSecret(result.client_secret);
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const options = {
    clientSecret,
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Preparing payment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              Unable to initialize payment. Please try again.
            </p>
            <Button onClick={createCheckoutSessionHandler} variant="outline">
              Retry
            </Button>
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
          Complete Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Elements options={options} stripe={stripePromise}>
          <EmbeddedCheckoutProvider
            options={options}
            stripe={stripePromise}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </Elements>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeCheckout;

