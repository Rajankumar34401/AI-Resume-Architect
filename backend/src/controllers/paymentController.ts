import type { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const createCheckout = async (req: Request, res: Response) => {
  try {
    // 1. Check for Placeholder Key
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
      console.log("⚠️ Using Mock Redirect for India Invite-only restriction");
      return res.json({ url: 'http://localhost:5173/preview?paid=true' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // 2. Real Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { 
            name: 'CareerForge Pro Unlock',
            description: 'Unlock Premium Templates & High-Res PDF'
          },
          unit_amount: 500, // $5.00
        },
        quantity: 1,
      }],
      mode: 'payment',
      // The key: redirect back with the paid flag
      success_url: 'http://localhost:5173/preview?paid=true',
      cancel_url: 'http://localhost:5173/preview',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    // Fallback for demo stability
    res.json({ url: 'http://localhost:5173/preview?paid=true' });
  }
};