import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useCreateCheckoutSessionMutation } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

const StripeCheckout = ({ booking, onCancel }) => {
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  const stripePromise = useMemo(() => {
    if (!STRIPE_PK) {
      console.error("Missing VITE_STRIPE_PUBLISHABLE_KEY");
      toast.error("Stripe is not configured on the client.");
      return null;
    }
    return loadStripe(STRIPE_PK);
  }, []);

  useEffect(() => {
    (async () => {
      if (!booking?._id) return;
      setLoading(true);
      try {
        const res = await createCheckoutSession({ bookingId: booking._id }).unwrap();
        if (!res?.client_secret) throw new Error("No client_secret returned from server");
        setClientSecret(res.client_secret);
      } catch (err) {
        console.error("Failed to init checkout:", err);
        toast.error(err?.data?.message || "Failed to initialize payment.");
      } finally {
        setLoading(false);
      }
    })();
  }, [booking, createCheckoutSession]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Secure Checkout
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!stripePromise || !clientSecret ? (
          <div className="flex items-center justify-center gap-2 py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>{loading ? "Preparing checkout…" : "Loading…"}</span>
          </div>
        ) : (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={() => (window.location.href = "/my-account")} className="flex-1">
            View Bookings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeCheckout;