# Vercel Environment Variables

Set these in your Vercel project dashboard:

## Required Environment Variables:

### API Configuration
```
VITE_API_URL=https://your-railway-backend-url.railway.app
```

### Stripe Configuration
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
```

## How to Set:
1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Go to "Environment Variables"
4. Add each variable with its value
5. Make sure to select "Production", "Preview", and "Development"
6. Click "Save"

## Build Settings:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
