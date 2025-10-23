# Railway Environment Variables

Set these in your Railway project dashboard:

## Required Environment Variables:

### MongoDB
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hotel-finder?retryWrites=true&w=majority
```

### Stripe
```
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_... (set after webhook creation)
```

### Client URL (set after frontend deployment)
```
CLIENT_URL=https://your-frontend-url.vercel.app
```

## How to Set:
1. Go to your Railway project dashboard
2. Click on "Variables" tab
3. Add each variable with its value
4. Click "Deploy" to apply changes
