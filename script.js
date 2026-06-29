// server.js (Express.js Environment Core Configuration)
const express = require('express');
const cors = require('cors');
const app = express();

const trustedOrigins = [
  'https://fable-platform.vercel.app', 
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Enable seamless matching access for serverless background cron routes or local testing arrays
    if (!origin || trustedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Transaction execution block: Origin rejected by CORS protection policy schemas.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Global Pre-flight request execution channel fallback interceptor
app.options('*', cors());
// controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Ebook = require('../models/Ebook');
const Transaction = require('../models/Transaction');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { ebookId } = req.body;
    const buyerId = req.user.id; // Decoded directly out of validated request JWT header payloads

    const ebook = await Ebook.findById(ebookId);
    if (!ebook || ebook.availability === 'sold') {
      return res.status(404).json({ success: false, message: "Target asset unavailable for procurement processing." });
    }

    if (ebook.writer.toString() === buyerId) {
      return res.status(400).json({ success: false, message: "Transaction blocked: Creators cannot purchase their own products." });
    }

    // Initialize Stripe Session object with strict product descriptors
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.CLIENT_ORIGIN_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_ORIGIN_URL}/ebook/${ebook._id}`,
      customer_email: req.user.email,
      metadata: { ebookId, buyerId },
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: ebook.title,
            description: `Fable Premium Ebook Authorization: ${ebook.genre}`,
          },
          unit_amount: Math.round(ebook.price * 100), // Standard Stripe formatting (integer values tracked in cents)
        },
        quantity: 1,
      }],
    });

    res.status(200).json({ success: true, id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};