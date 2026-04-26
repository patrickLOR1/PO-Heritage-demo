import Stripe from 'stripe';

// Stripe is optional — checkout flows use WhatsApp by default
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-01-27' as any,
    })
  : null;
