import React, { useState, useEffect } from 'react';

export default function EbookDetails({ ebookId = "1" }) {
  // --- PRODUCTION ROLE-BASED AUTHENTICATION MATRIX MOCK ---
  // In production, pull these properties from your Global Context/Auth state setup.
  const currentUser = {
    id: "user_999",       // Change to "writer_123" to test self-purchase restriction
    role: "reader",       // options: 'guest', 'reader', 'writer', 'admin'
    isAuthenticated: true
  };

  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isRedirectingToStripe, setIsRedirectingToStripe] = useState(false);

  // --- DATABASE DATA SIMULATION ---
  useEffect(() => {
    const fetchEbookDetails = async () => {
      try {
        setLoading(true);
        // Simulate database latency
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Invalid ID simulation trigger
        if (ebookId === "invalid") {
          setError(true);
          return;
        }

        const mockDbEbook = {
          id: "1",
          title: "The Quantum Paradox: Echoes of Eternity",
          writerId: "writer_123",
          writerName: "Elena Vance",
          description: "Dr. Catherine Cole thought she discovered a clean energy matrix, but instead unlocked a cascading multi-verse rift. As timelines actively overwrite themselves around her, she must collaborate with alternative echoes of her own identity before the fabric of the baseline reality collapses completely into a localized singularity.",
          fullContent: "CONGRATULATIONS! You have successfully purchased this title. [ This is the restricted premium content layer containing Chapters 1 through 34 of 'The Quantum Paradox' decrypted straight from the protected cloud instance. ]",
          price: 9.99,
          genre: "Sci-Fi / Cyberpunk",
          status: "Available", // Available or Sold
          uploadedAt: "March 14, 2026",
          coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800" // Simulated premium high-res asset destination
        };

        setEbook(mockDbEbook);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEbookDetails();
  }, [ebookId]);

  // --- BUSINESS RULES & INTERACTION LAYER ---
  const isWriter = ebook && currentUser.id === ebook.writerId;
  
  const handleBookmarkToggle = () => {
    if (!currentUser.isAuthenticated) {
      alert("Please log in to save items to your personal reading bookmarks.");
      return;
    }
    setIsBookmarked(!isBookmarked);
  };

  const handlePurchaseAction = async () => {
    // 1. Guard Rule: Enforce authentication
    if (!currentUser.isAuthenticated) {
      alert("Authentication Required: Please sign in to purchase digital copies.");
      return;
    }

    // 2. Guard Rule: Enforce correct consumer permission role profiles
    if (currentUser.role === "admin") {
      alert("Action Restricted: Administrator accounts cannot register purchases.");
      return;
    }

    try {
      setIsRedirectingToStripe(true);
      console.log(`Initiating checkout payload mapping for Ebook reference: ${ebook.id}`);
      
      // Simulating Stripe Checkout API Routing Process
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Simulating successful return webhook processing
      setHasPurchased(true);
      alert("Payment Complete: Stripe API verified. Content unlocked.");
    } catch (err) {
      alert("Stripe interface initialization failure. Please try again.");
    } finally {
      setIsRedirectingToStripe(false);
    }
  };

  // --- CONDITION 1: SKELETON LOADER STATE ---
  if (loading) {
    return (
      <div class="bg-slate-50 min-h-screen p-4 md:p-12 animate-pulse flex justify-center items-center">
        <div class="max-w-5xl w-full bg-white rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="aspect-[3/4] bg-slate-200 rounded-2xl w-full"></div>
          <div class="md:col-span-2 space-y-4 py-4">
            <div class="h-4 bg-slate-200 rounded w-1/4"></div>
            <div class="h-8 bg-slate-200 rounded w-3/4"></div>
            <div class="h-4 bg-slate-200 rounded w-1/3"></div>
            <div class="h-32 bg-slate-200 rounded w-full pt-4"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- CONDITION 2: ERROR/INVALID DATA STATE ---
  if (error || !ebook) {
    return (
      <div class="bg-slate-50 min-h-screen flex items-center justify-center p-4 text-center">
        <div class="bg-white border border-slate-200 max-w-md w-full p-8 rounded-3xl shadow-sm">
          <span class="text-5xl">🚫</span>
          <h2 class="text-xl font-bold text-slate-950 mt-4">Ebook Not Found</h2>
          <p class="text-slate-500 text-sm mt-2">The ebook item ID may be invalid, modified, or scrubbed by system administration.</p>
          <a href="/browse" class="mt-6 inline-block text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition">
            Return to Library
          </a>
        </div>
      </div>
    );
  }

  // --- CONDITION 3: RENDER CORE APP VIEWPORT ---
  return (
    <div class="bg-slate-50 min-h-screen text-slate-800 antialiased py-10 px-4 md:px-8">
      <div class="max-w-5xl mx-auto space-y-8">
        
        {/* BACK BREADCRUMB BUTTON */}
        <a href="/browse" class="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition gap-2">
          &larr; Back to Library
        </a>

        {/* METADATA SUMMARY GRID CONTAINER */}
        <main class="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-8 p-6 md:p-10">
          
          {/* COLUMN 1: INTERACTIVE HIGH-RES COVER */}
          <div class="flex flex-col gap-4">
            <div class="aspect-[3/4] w-full bg-slate-100 rounded-2xl overflow-hidden shadow-md border border-slate-200">
              <img 
                src={ebook.coverUrl} 
                alt={ebook.title} 
                class="w-full h-full object-cover"
              />
            </div>
            
            {/* BOOKMARK CONTROL BUTTON */}
            <button 
              onClick={handleBookmarkToggle}
              class={`w-full py-3 rounded-xl border font-semibold text-sm transition flex items-center justify-center gap-2 ${
                isBookmarked 
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{isBookmarked ? '★' : '☆'}</span>
              {isBookmarked ? 'Bookmarked for Later' : 'Bookmark Title'}
            </button>
          </div>

          {/* COLUMN 2 & 3: DETAIL CONTENT METRICS */}
          <div class="md:col-span-2 flex flex-col justify-between space-y-6">
            <div class="space-y-4">
              {/* GENRE AND AVAILABILITY CHIPS */}
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-wider">
                  {ebook.genre}
                </span>
                <span class={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                  ebook.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  ● {ebook.status}
                </span>
              </div>

              {/* TITLE AND CLICKABLE AUTHOR PROFILE */}
              <h1 class="text-2xl md:text-4xl font-extrabold text-slate-950 tracking-tight leading-tight">
                {ebook.title}
              </h1>
              
              <p class="text-sm font-medium text-slate-500">
                By{' '}
                <a href={`/writers/${ebook.writerId}`} class="text-indigo-600 hover:text-indigo-800 underline transition decoration-indigo-200 underline-offset-4">
                  {ebook.writerName}
                </a>
              </p>

              <hr class="border-slate-100" />

              {/* READ-ONLY REVEAL PREVIEW */}
              <div class="space-y-2">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview Synopsis</h3>
                <p class="text-slate-600 text-sm md:text-base leading-relaxed font-light">
                  {ebook.description}
                </p>
              </div>

              {/* METADATA LIST TABLE */}
              <div class="pt-2 grid grid-cols-2 gap-4 max-w-sm text-xs">
                <div>
                  <span class="text-slate-400 block">Date Uploaded</span>
                  <span class="font-semibold text-slate-700">{ebook.uploadedAt}</span>
                </div>
                <div>
                  <span class="text-slate-400 block">Format Type</span>
                  <span class="font-semibold text-slate-700">Digital EPUB / PDF</span>
                </div>
              </div>
            </div>

            {/* LOWER FINANCIAL ACTION COMPONENT ROW */}
            <div class="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span class="text-xs text-slate-400 block font-medium uppercase tracking-wider">Purchase Valuation</span>
                <span class="text-2xl font-black text-slate-950">${ebook.price.toFixed(2)}</span>
              </div>

              {/* CONTEXT-DRIVEN SYSTEM BUTTON */}
              {hasPurchased ? (
                <button class="bg-emerald-100 text-emerald-800 font-bold text-sm px-6 py-3 rounded-xl cursor-default flex items-center gap-2">
                  ✓ Already Purchased
                </button>
              ) : isWriter ? (
                <div class="text-right">
                  <button disabled class="bg-slate-200 text-slate-400 font-bold text-sm px-6 py-3 rounded-xl cursor-not-allowed">
                    Purchase Disabled
                  </button>
                  <span class="block text-[10px] text-red-500 font-medium mt-1">You cannot buy your own original content.</span>
                </div>
              ) : (
                <button
                  onClick={handlePurchaseAction}
                  disabled={isRedirectingToStripe}
                  class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-8 py-3 rounded-xl transition shadow-md shadow-indigo-600/10 disabled:opacity-50 flex items-center gap-2 justify-center"
                >
                  {isRedirectingToStripe ? (
                    <>
                      <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Connecting to Stripe...
                    </>
                  ) : (
                    'Buy via Stripe Checkout'
                  )}
                </button>
              )}
            </div>
          </div>
        </main>

        {/* ================= PREMIUM LAYER RENDER ENVELOPE ================= */}
        <section class="mt-8">
          {hasPurchased ? (
            <div class="bg-indigo-950 text-slate-100 border border-indigo-900 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
              <div class="flex items-center gap-3 border-b border-indigo-800 pb-3">
                <span class="text-xl">🔓</span>
                <h2 class="text-lg font-bold text-white tracking-wide">Unlocked Document Ledger</h2>
              </div>
              <p class="font-mono text-sm leading-relaxed text-slate-300 bg-black/20 p-4 rounded-xl border border-white/5">
                {ebook.fullContent}
              </p>
            </div>
          ) : (
            <div class="bg-white border-2 border-dashed border-slate-200 text-slate-400 text-center py-10 rounded-3xl">
              <span class="text-2xl block mb-2">🔒</span>
              <p class="text-sm max-w-sm mx-auto">Full content manuscript access is encrypted. Complete checkout verification step to unlock access keys.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
