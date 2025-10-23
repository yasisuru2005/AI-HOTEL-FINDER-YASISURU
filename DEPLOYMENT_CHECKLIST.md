# 🚀 Hotel Finder Deployment Checklist

## Pre-Deployment Setup ✅

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster (M0 Sandbox)
- [ ] Set up database user with read/write permissions
- [ ] Configure network access (0.0.0.0/0)
- [ ] Copy connection string
- [ ] Test connection locally

### 2. Stripe Account Setup
- [ ] Create Stripe account
- [ ] Get API keys (publishable and secret)
- [ ] Note test card numbers for testing
- [ ] Set up webhook endpoint

## Backend Deployment (Railway) 🚂

### 3. Railway Setup
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Deploy backend project
- [ ] Set environment variables:
  - [ ] `MONGODB_URI`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET` (after webhook setup)
  - [ ] `CLIENT_URL` (after frontend deployment)

### 4. Test Backend
- [ ] Check Railway deployment logs
- [ ] Test health endpoint: `https://your-app.railway.app/api/health`
- [ ] Test hotels endpoint: `https://your-app.railway.app/api/hotels`
- [ ] Verify database connection

## Frontend Deployment (Vercel) ⚡

### 5. Vercel Setup
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure build settings (Vite)
- [ ] Set environment variables:
  - [ ] `VITE_API_URL` (Railway backend URL)
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY`
- [ ] Deploy frontend

### 6. Test Frontend
- [ ] Visit Vercel URL
- [ ] Test page loading
- [ ] Test navigation
- [ ] Test API calls to backend

## Stripe Webhook Configuration 💳

### 7. Webhook Setup
- [ ] Create webhook endpoint in Stripe
- [ ] Set endpoint URL to Railway backend
- [ ] Select events: `checkout.session.completed`
- [ ] Copy webhook secret
- [ ] Add to Railway environment variables
- [ ] Test webhook with test payments

## Final Testing 🧪

### 8. End-to-End Testing
- [ ] Browse hotels on frontend
- [ ] Test filtering and search
- [ ] Select a hotel and view details
- [ ] Create a booking
- [ ] Complete payment with test card
- [ ] Verify booking appears in "My Account"
- [ ] Test error scenarios

### 9. Production Verification
- [ ] All pages load without errors
- [ ] No white pages or broken links
- [ ] Authentication works
- [ ] Payment processing works
- [ ] Database operations work
- [ ] Email notifications work (if implemented)

## Post-Deployment 🎉

### 10. Monitoring & Maintenance
- [ ] Set up monitoring (Railway/Vercel dashboards)
- [ ] Monitor error logs
- [ ] Set up alerts for failures
- [ ] Regular backups of database
- [ ] Update dependencies regularly

## URLs After Deployment
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-project.railway.app`
- **API Health**: `https://your-project.railway.app/api/health`
- **API Hotels**: `https://your-project.railway.app/api/hotels`

## Support Resources
- Railway Documentation: https://docs.railway.app
- Vercel Documentation: https://vercel.com/docs
- Stripe Documentation: https://stripe.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
