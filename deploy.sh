#!/bin/bash

# Hotel Finder Deployment Script
echo "🚀 Starting Hotel Finder Deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📦 Building frontend..."
npm run build

echo "🚀 Deploying backend to Railway..."
railway up

echo "🌐 Deploying frontend to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Set up MongoDB Atlas production cluster"
echo "2. Configure Stripe webhooks"
echo "3. Update environment variables"
echo "4. Test end-to-end functionality"

