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
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SmoothNavBar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navItems = ['Home', 'Browse', 'Writers', 'Dashboard'];

  return (
    <nav class="flex items-center space-x-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
      {navItems.map((item, index) => (
        <a
          key={item}
          href="#"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          class="relative px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors duration-300"
        >
          {/* Dynamic Sliding Background Pill */}
          {hoveredIndex === index && (
            <motion.span
              layoutId="navHoverPill"
              class="absolute inset-0 bg-indigo-50 rounded-xl z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
          {/* Ensure text remains above the sliding background z-index layer */}
          <span class="relative z-10">{item}</span>
        </a>
      ))}
    </nav>
  );
}
import React from 'react';
import { motion } from 'framer-motion';

const navContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delays each link's appearance slightly
      delayChildren: 0.2
    }
  }
};

const navItemVariants = {
  hidden: { opacity: 0, y: -15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 120, damping: 14 } 
  }
};

export default function AnimatedNav() {
  const links = ['Overview', 'Browse Library', 'Top Writers', 'Settings'];

  return (
    <motion.nav 
      variants={navContainerVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-6"
    >
      {links.map((link) => (
        <motion.a
          key={link}
          variants={navItemVariants}
          href="#"
          className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors py-2"
        >
          {link}
        </motion.a>
      ))}
    </motion.nav>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sliderAssets = [
  {
    id: 1,
    title: "The Digital Literature Revolution",
    subtitle: "Connecting raw source manuscripts with immediate global audience networks instantly.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600"
  },
  {
    id: 2,
    title: "Secure Intellectual Property Rights",
    subtitle: "Protecting independent creative ledger systems utilizing institutional encryption models.",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1600"
  }
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % sliderAssets.length);
    }, 6000);
    return () => clearInterval(slideTimer);
  }, []);

  return (
    <div class="relative w-full h-[460px] md:h-[580px] bg-slate-950 overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          class="absolute inset-0 w-full h-full"
        >
          {/* IMAGE LAYER */}
          <img 
            src={sliderAssets[index].image} 
            alt={sliderAssets[index].title}
            class="w-full h-full object-cover opacity-35 filter contrast-125 select-none"
          />
          {/* PREMIUM DEEP VIGNETTE GRADIENT OVERLAY FILL ARCHITECTURE */}
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/60" />

          {/* CAROUSEL GRAPHIC LABELS CONTAINER */}
          <div class="absolute inset-0 flex items-center justify-center text-center px-4">
            <div class="max-w-4xl mx-auto space-y-6">
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                class="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight"
              >
                {sliderAssets[index].title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                class="text-base md:text-xl text-slate-300 font-light max-w-2xl mx-auto"
              >
                {sliderAssets[index].subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                class="pt-4"
              >
                <a href="/browse" class="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-8 py-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-transform transform hover:-translate-y-0.5">
                  Browse Global Ebooks
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* DYNAMIC PAGINATION CAROUSEL TICKERS */}
      <div class="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2.5 z-20">
        {sliderAssets.map((_, dotIdx) => (
          <button
            key={dotIdx}
            onClick={() => setIndex(dotIdx)}
            class={`h-1.5 transition-all duration-300 rounded-full ${index === dotIdx ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-500'}`}
          />
        ))}
      </div>
    </div>
  );
}  