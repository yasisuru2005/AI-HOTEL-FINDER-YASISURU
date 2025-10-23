# Hotel Finder - Deployment Guide

## Backend Deployment (Railway)

### 1. Prerequisites
- Railway account (sign up at railway.app)
- MongoDB Atlas account
- Stripe account with API keys

### 2. Deploy to Railway

1. **Connect Repository**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login to Railway
   railway login
   
   # Initialize project
   railway init
   ```

2. **Set Environment Variables**
   ```bash
   # MongoDB
   railway variables set MONGODB_URI="your-mongodb-atlas-connection-string"
   
   # Stripe
   railway variables set STRIPE_SECRET_KEY="your-stripe-secret-key"
   railway variables set STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
   
   # Client URL (will be set after frontend deployment)
   railway variables set CLIENT_URL="https://your-frontend-url.vercel.app"
   ```

3. **Deploy**
   ```bash
   railway up
   ```

### 3. MongoDB Atlas Setup

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create a new cluster
   - Choose your preferred region
   - Set up database user with read/write permissions

2. **Network Access**
   - Add IP address 0.0.0.0/0 (allow all) for Railway
   - Or add Railway's specific IP ranges

3. **Get Connection String**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name

## Frontend Deployment (Vercel)

### 1. Prerequisites
- Vercel account (sign up at vercel.com)
- GitHub repository

### 2. Deploy to Vercel

1. **Connect Repository**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app
   VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

### 3. Update Backend Environment

After frontend deployment, update the backend:
```bash
railway variables set CLIENT_URL="https://your-frontend-url.vercel.app"
```

## Stripe Webhook Configuration

### 1. Create Webhook Endpoint
- Go to Stripe Dashboard > Webhooks
- Add endpoint: `https://your-railway-backend-url.railway.app/api/payments/webhook`
- Select events: `checkout.session.completed`
- Copy webhook secret

### 2. Update Environment Variables
```bash
railway variables set STRIPE_WEBHOOK_SECRET="your-webhook-secret"
```

## Testing Production

### 1. Test Backend
```bash
curl https://your-railway-backend-url.railway.app/api/health
```

### 2. Test Frontend
- Visit your Vercel URL
- Test hotel browsing
- Test filtering
- Test booking flow
- Test payment (use Stripe test cards)

### 3. Test End-to-End
1. Browse hotels
2. Filter by location, price, amenities
3. Select a hotel
4. Create booking
5. Complete payment
6. Check booking in "My Account"

## Environment Variables Summary

### Backend (Railway)
- `MONGODB_URI` - MongoDB Atlas connection string
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `CLIENT_URL` - Frontend URL (set after frontend deployment)
- `PORT` - Railway sets this automatically

### Frontend (Vercel)
- `VITE_API_URL` - Backend API URL
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

## URLs After Deployment

- **Backend**: `https://your-project-name.railway.app`
- **Frontend**: `https://your-project-name.vercel.app`
- **API Health**: `https://your-project-name.railway.app/api/health`
- **API Hotels**: `https://your-project-name.railway.app/api/hotels`
