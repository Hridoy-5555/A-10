import React, { useState, useEffect } from 'react';

export default function BrowseEbooks() {
  // Mock Auth State (In production, pull this from your Context or Auth Provider)
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  
  // Core UI & Data States
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  // Simulated Database Fetching
  useEffect(() => {
    const fetchAllEbooks = async () => {
      try {
        setLoading(true);
        // Simulating network response delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockDbEbooks = [
          { id: '1', title: 'The Quantum Paradox', author: 'Elena Vance', price: 9.99, genre: 'Sci-Fi', isSold: true, cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
          { id: '2', title: 'Shadows of Noir', author: 'Marcus Cole', price: 4.99, genre: 'Mystery', isSold: false, cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
          { id: '3', title: 'Crimson Ribbons', author: 'Sarah Jenkins', price: 7.50, genre: 'Romance', isSold: false, cover: 'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?w=400' },
          { id: '4', title: 'Beyond the Event Horizon', author: 'Elena Vance', price: 12.00, genre: 'Sci-Fi', isSold: false, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400' },
          { id: '5', title: 'Whispers in the Woods', author: 'David Blake', price: 3.99, genre: 'Horror', isSold: true, cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400' },
          { id: '6', title: 'Chronicles of Mythos', author: 'Anya Petrova', price: 8.99, genre: 'Fantasy', isSold: false, cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400' },
          { id: '7', title: 'The Midnight Code', author: 'Marcus Cole', price: 0.00, genre: 'Fiction', isSold: false, cover: 'https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?w=400' },
          { id: '8', title: 'Haunted Echoes', author: 'David Blake', price: 5.49, genre: 'Horror', isSold: false, cover: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400' },
        ];

        setEbooks(mockDbEbooks);
      } catch (err) {
        setError('Failed to fetch ebooks. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllEbooks();
  }, []);

  // --- ACTION HANDLERS ---
  const handleCardClick = (ebookId) => {
    // Standard routing mechanism (e.g., react-router-dom or Next.js Link)
    console.log(`Navigating to details page for ebook ID: ${ebookId}`);
    window.location.href = `/ebooks/${ebookId}`;
  };

  const handlePurchase = (e, ebook) => {
    e.stopPropagation(); // Prevents clicking the button from executing the card navigate click
    
    if (!isAuthenticated) {
      alert('Authentication Required: Please log in or sign up to complete your purchase.');
      // window.location.href = '/login';
      return;
    }

    alert(`Proceeding to checkout for "${ebook.title}"`);
  };

  // --- FILTER & SORT LOGIC ---
  const filteredEbooks = ebooks
    .filter((ebook) => {
      const matchesSearch = ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            ebook.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || ebook.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0; // Default or 'latest' placeholder placement
    });

  return (
    <div class="bg-slate-50 min-h-screen text-slate-800 antialiased">
      <div class="max-w-7xl mx-auto px-4 py-10 space-y-8">
        
        {/* HEADER TITLE */}
        <div>
          <h1 class="text-3xl md:text-4xl font-black text-slate-950 tracking-tight">Explore Library</h1>
          <p class="text-slate-500 mt-1">Discover completely original electronic titles from global authors.</p>
        </div>

        {/* CONTROLS BAR: SEARCH / FILTER / SORT */}
        <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Search Inputs */}
          <div class="md:col-span-2 relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              type="text"
              placeholder="Search by book title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Genre Filter */}
          <div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="All">All Genres</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
              <option value="Fiction">General Fiction</option>
            </select>
          </div>

          {/* Sorting Field */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer"
            >
              <option value="latest">Sort By: Newest</option>
              <option value="title">Sort By: Alphabetical</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* LOADING STATE (SKELETON CARDS GRID) */}
        {loading && (
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} class="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 animate-pulse">
                <div class="aspect-[3/4] bg-slate-200 rounded-xl w-full"></div>
                <div class="h-4 bg-slate-200 rounded w-3/4"></div>
                <div class="h-3 bg-slate-200 rounded w-1/2"></div>
                <div class="h-8 bg-slate-200 rounded w-full pt-2"></div>
              </div>
            ))}
          </div>
        )}

        {/* DYNAMIC RENDER AND FRIENDLY EMPTY STATE */}
        {!loading && !error && (
          filteredEbooks.length === 0 ? (
            <div class="text-center py-20 bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
              <span class="text-4xl">📚</span>
              <h3 class="text-lg font-bold text-slate-900 mt-4">No matching ebooks</h3>
              <p class="text-slate-500 text-sm mt-1">We couldn't find anything matching your search filters. Try adjusting your parameters or keyword spelling.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedGenre('All'); setSortBy('latest'); }} 
                class="mt-5 text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* RESPONSIVE GRID LAYOUT RULE (2 Columns Mobile, 3 Tablet, 4 Desktop) */
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredEbooks.map((ebook) => (
                <div 
                  key={ebook.id}
                  onClick={() => handleCardClick(ebook.id)}
                  class="group bg-white rounded-2xl border border-slate-200/70 p-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail Image Wrapper */}
                    <div class="aspect-[3/4] relative overflow-hidden rounded-xl bg-slate-100 shadow-inner mb-4">
                      <img 
                        src={ebook.cover} 
                        alt={ebook.title} 
                        class="object-cover w-full h-full transform transition-transform group-hover:scale-[1.03] duration-300"
                      />
                      
                      {/* Sold Out/Purchased Condition Badge */}
                      {ebook.isSold && (
                        <span class="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Sold
                        </span>
                      )}
                    </div>

                    {/* Meta Specifications */}
                    <h3 class="font-bold text-slate-900 text-sm md:text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {ebook.title}
                    </h3>
                    <p class="text-slate-500 text-xs mt-0.5">{ebook.author}</p>
                  </div>

                  {/* Pricing Matrix & Purchase Trigger Action Row */}
                  <div class="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span class="font-extrabold text-slate-900 text-base">
                      {ebook.price === 0 ? 'Free' : `$${ebook.price.toFixed(2)}`}
                    </span>
                    <button
                      onClick={(e) => handlePurchase(e, ebook)}
                      disabled={ebook.isSold}
                      class={`text-xs font-semibold px-3 py-2 rounded-xl text-center transition-colors ${
                        ebook.isSold 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed w-full sm:w-auto' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto'
                      }`}
                    >
                      {ebook.isSold ? 'Owned' : 'Get Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>
    </div>
  );
}