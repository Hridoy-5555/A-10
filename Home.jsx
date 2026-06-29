import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- ANIMATION CONFIGURATIONS ---
const fadeInVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Creates the staggered reveal on scroll
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 60 } 
  }
};

export default function HomePage() {
  const [featuredEbooks, setFeaturedEbooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated Database Fetch for Featured Ebooks (Latest 6)
  useEffect(() => {
    // Replace this mock with your actual database API call: fetch('/api/ebooks?limit=6')
    const fetchEbooks = async () => {
      try {
        setIsLoading(true);
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        const mockDbData = [
          { id: 1, title: 'The Quantum Paradox', author: 'Elena Vance', price: '$9.99', cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
          { id: 2, title: 'Shadows of Noir', author: 'Marcus Cole', price: '$4.99', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
          { id: 3, title: 'Crimson Ribbons', author: 'Sarah Jenkins', price: '$7.50', cover: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=400' },
          { id: 4, title: 'Beyond the Event Horizon', author: 'Elena Vance', price: '$12.00', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400' },
          { id: 5, title: 'Whispers in the Woods', author: 'David Blake', price: '$3.99', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
          { id: 6, title: 'Chronicles of Mythos', author: 'Anya Petrova', price: '$8.99', cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400' },
        ];
        
        setFeaturedEbooks(mockDbData);
      } catch (error) {
        console.error("Failed fetching ebooks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  // Hardcoded Static Data requested for Extra Sections
  const topWriters = [
    { id: 1, name: 'Elena Vance', sales: '14,200+ sales', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 2, name: 'Marcus Cole', sales: '9,850+ sales', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 3, name: 'Sarah Jenkins', sales: '8,100+ sales', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
  ];

  const genres = [
    { name: 'Fiction', icon: '📖', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700' },
    { name: 'Mystery', icon: '🕵️‍♂️', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700' },
    { name: 'Romance', icon: '💖', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
    { name: 'Sci-Fi', icon: '🚀', color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700' },
    { name: 'Fantasy', icon: '🧝‍♀️', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700' },
    { name: 'Horror', icon: '👻', color: 'bg-red-50 hover:bg-red-100 text-red-700' },
  ];

  return (
    <div class="bg-slate-50 min-h-screen text-slate-800 antialiased overflow-x-hidden">
      
      {/* ================= HERO SECTION ================= */}
      <section class="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-24 md:py-32 px-4 flex items-center justify-center text-center">
        <div class="max-w-4xl mx-auto space-y-6">
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={fadeInVariant}
            class="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight"
          >
            Discover & Read <br class="hidden sm:inline" />
            <span class="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Original Ebooks</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            class="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light"
          >
            Dive into exceptional worlds crafted by independent writers. Instant access, anywhere, on any device.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            class="pt-4"
          >
            <a 
              href="/browse" 
              class="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Browse Ebooks
              <svg class="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURED EBOOKS DYNAMIC SECTION ================= */}
      <section class="max-w-7xl mx-auto px-4 py-20">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 class="text-3xl font-bold text-slate-950 tracking-tight">Featured Ebooks</h2>
            <p class="text-slate-500 mt-2">Handpicked masterpieces fresh from our community</p>
          </div>
          <a href="/browse" class="text-indigo-600 font-medium hover:text-indigo-500 transition mt-4 md:mt-0 inline-flex items-center gap-1">
            View all books <span>&rarr;</span>
          </a>
        </div>

        {isLoading ? (
          /* Skeleton Loader State */
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} class="space-y-4 animate-pulse">
                <div class="bg-slate-200 h-64 w-full rounded-xl"></div>
                <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                <div class="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Framer Motion Staggered Grid Reveal */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          >
            {featuredEbooks.map((ebook) => (
              <motion.div 
                key={ebook.id}
                variants={cardVariants}
                whileHover={{ scale: 1.04, y: -4 }} // Hover scaling/floating effect
                class="group bg-white rounded-xl border border-slate-200/60 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div class="aspect-[3/4] relative overflow-hidden rounded-lg bg-slate-100 shadow-inner mb-4">
                  <img 
                    src={ebook.cover} 
                    alt={ebook.title} 
                    class="object-cover w-full h-full transform transition-transform group-hover:scale-105 duration-300" 
                  />
                </div>
                <h3 class="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">{ebook.title}</h3>
                <p class="text-slate-500 text-xs mt-0.5">{ebook.author}</p>
                <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span class="font-semibold text-slate-900 text-sm">{ebook.price}</span>
                  <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">Digital</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ================= EXTRA SECTION 1: TOP WRITERS ================= */}
      <section class="bg-slate-100 py-20 border-y border-slate-200/50">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold text-slate-950 tracking-tight">Top Writers</h2>
          <p class="text-slate-500 mt-2 mb-12">The brilliant minds leading our charts this month</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {topWriters.map((writer, index) => (
              <div key={writer.id} class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/40 flex flex-col items-center relative overflow-hidden">
                {/* Ranking Badge */}
                <div class="absolute top-3 right-4 font-black text-slate-200 text-4xl">#{index + 1}</div>
                
                <img 
                  src={writer.avatar} 
                  alt={writer.name} 
                  class="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-50 shadow-md mb-4" 
                />
                <h3 class="font-bold text-slate-900 text-lg">{writer.name}</h3>
                <p class="text-indigo-600 font-medium text-sm mt-1">{writer.sales}</p>
                
                <a href={`/author/${writer.id}`} class="mt-4 text-xs font-semibold text-slate-500 hover:text-indigo-600 border border-slate-200 px-4 py-2 rounded-lg hover:border-indigo-100 transition">
                  View Profile
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= EXTRA SECTION 2: EBOOK GENRES ================= */}
      <section class="max-w-7xl mx-auto px-4 py-20">
        <div class="text-center max-w-xl mx-auto mb-12">
          <h2 class="text-3xl font-bold text-slate-950 tracking-tight">Explore Genres</h2>
          <p class="text-slate-500 mt-2">Find exactly what you are looking for across our literary universes</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <a 
              key={genre.name}
              href={`/browse?genre=${genre.name.toLowerCase()}`}
              class={`flex flex-col items-center justify-center p-6 rounded-2xl font-semibold border border-transparent tracking-wide text-center shadow-sm transition-all transform hover:-translate-y-1 ${genre.color}`}
            >
              <span class="text-3xl mb-3 filter drop-shadow-sm">{genre.icon}</span>
              <span class="text-base">{genre.name}</span>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
}