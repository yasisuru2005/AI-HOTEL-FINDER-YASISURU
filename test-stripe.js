#!/usr/bin/env node

// Test script for Stripe integration
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const testStripeIntegration = async () => {
  console.log("Testing Stripe Integration...\n");

  // Check if Stripe keys are configured
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY;

  console.log("📋 Configuration Check:");
  console.log(`STRIPE_SECRET_KEY: ${secretKey ? 'et' : 'Missing'}`);
  console.log(`VITE_STRIPE_PUBLISHABLE_KEY: ${publishableKey ? 'Set' : 'Missing'}`);
  console.log(`CLIENT_URL: ${process.env.CLIENT_URL || 'Missing'}\n`);

  if (!secretKey || !publishableKey) {
    console.log("Stripe keys are not configured!");
    console.log("Please update your .env file with your Stripe keys.\n");
    return;
  }

  // Test Stripe initialization
  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secretKey);
    
    console.log("Stripe initialized successfully!");
    
    // Test API connection
    const account = await stripe.accounts.retrieve();
    console.log(`Connected to Stripe account: ${account.id}`);
    console.log(`Account country: ${account.country}`);
    console.log(`Charges enabled: ${account.charges_enabled ? 'Yes' : 'No'}`);
    
  } catch (error) {
    console.log("Stripe initialization failed:");
    console.log(error.message);
  }

  console.log("Next steps:");
  console.log("1. Update your .env file with real Stripe keys");
  console.log("2. Restart your backend server");
  console.log("3. Test the booking flow in your frontend");
};

testStripeIntegration().catch(console.error);
