# 🧪 Stripe Payment Gateway Testing Guide

## 📋 Prerequisites

1. **Stripe Account**: Sign up at https://stripe.com
2. **Test Mode**: Ensure you're in Test Mode in Stripe Dashboard
3. **API Keys**: Get your test API keys from Stripe Dashboard

## 🔑 Step 1: Get Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Toggle **Test Mode** ON (top right corner)
3. Navigate to **Developers** → **API keys**
4. Copy your keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

## ⚙️ Step 2: Configure Environment Variables

Update your `.env` file with your actual Stripe keys:

```bash
# Replace these with your actual Stripe keys
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLIENT_URL=http://localhost:5173
```

## 🧪 Step 3: Test Stripe Configuration

Run the test script to verify your configuration:

```bash
node test-stripe.js
```

Expected output:
```
🧪 Testing Stripe Integration...

📋 Configuration Check:
STRIPE_SECRET_KEY: ✅ Set
STRIPE_PUBLISHABLE_KEY: ✅ Set
CLIENT_URL: ✅ Set

✅ Stripe initialized successfully!
✅ Connected to Stripe account: acct_xxxxx
✅ Account country: US
✅ Charges enabled: Yes
```

## 🚀 Step 4: Restart Services

After updating your `.env` file:

```bash
# Stop and restart backend
pkill -f "node server.js"
npm run server

# Stop and restart frontend (in another terminal)
pkill -f "vite"
npm run dev
```

## 🎯 Step 5: Test Payment Flow

### 5.1 Create a Test Booking

1. Go to your frontend: http://localhost:5173
2. Navigate to any hotel details page
3. Fill out the booking form:
   - Check-in date: Tomorrow
   - Check-out date: Day after tomorrow
   - Number of guests: 2
4. Click "Book Now"

### 5.2 Test Stripe Checkout

1. You should see the Stripe Embedded Checkout form
2. Use Stripe test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Insufficient funds**: `4000 0000 0000 9995`
3. Use any future date for expiry and any 3-digit CVC
4. Use any email address

### 5.3 Verify Payment Processing

1. **Check backend logs** for payment confirmation
2. **Check Stripe Dashboard** → **Payments** for transaction
3. **Check your app** → **My Account** for booking status

## 🔍 Step 6: Test Different Scenarios

### Test Cards:
- `4242 4242 4242 4242` - Visa (Success)
- `5555 5555 5555 4444` - Mastercard (Success)
- `3782 822463 10005` - American Express (Success)
- `4000 0000 0000 0002` - Declined
- `4000 0000 0000 9995` - Insufficient funds

### Error Testing:
1. Try with declined card
2. Try with insufficient funds
3. Try with invalid expiry date
4. Test webhook failures

## 🐛 Troubleshooting

### Common Issues:

1. **"Payment service not configured"**
   - Check if `STRIPE_SECRET_KEY` is set correctly
   - Restart backend server

2. **"Invalid API key"**
   - Verify you're using test keys (not live keys)
   - Check for extra spaces in `.env` file

3. **"No such payment_intent"**
   - Check if `VITE_STRIPE_PUBLISHABLE_KEY` matches your secret key
   - Restart frontend server

4. **Webhook errors**
   - For now, webhooks are optional for basic testing
   - Set `STRIPE_WEBHOOK_SECRET=` (empty) for initial testing

## 📊 Expected Results

After successful payment:
1. ✅ Booking status changes from "PENDING" to "PAID"
2. ✅ Payment appears in Stripe Dashboard
3. ✅ Booking appears in "My Account" page
4. ✅ User receives confirmation

## 🔄 Next Steps

Once basic payment testing works:
1. Set up webhooks for production
2. Test webhook endpoints
3. Implement payment failure handling
4. Add email confirmations

---

**Need help?** Check Stripe documentation: https://stripe.com/docs/testing
