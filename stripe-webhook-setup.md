# Stripe Webhook Setup

## Step-by-Step Webhook Configuration:

### 1. Access Stripe Dashboard
- Go to [Stripe Dashboard](https://dashboard.stripe.com)
- Navigate to "Developers" → "Webhooks"

### 2. Create New Webhook Endpoint
- Click "Add endpoint"
- Endpoint URL: `https://your-railway-backend-url.railway.app/api/payments/webhook`
- Description: "Hotel Finder Payment Webhook"

### 3. Select Events to Listen For
Select these events:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### 4. Get Webhook Secret
- After creating the webhook, click on it
- Copy the "Signing secret" (starts with `whsec_`)
- Add this to your Railway environment variables as `STRIPE_WEBHOOK_SECRET`

### 5. Test Webhook
- Use Stripe CLI or webhook testing tools
- Send test events to verify your endpoint responds correctly

## Important Notes:
- Webhook URL must be HTTPS
- Railway provides HTTPS by default
- Test with Stripe test cards first
- Monitor webhook logs in Stripe dashboard
