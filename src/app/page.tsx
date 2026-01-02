"use client";

import { useState, useEffect } from 'react';
import { ArticleCard } from '@/components/ArticleCard';
import { Navbar } from '@/components/Navbar';
import { Flame, Clock } from 'lucide-react';
import { supabase, DBArticle } from '@/lib/supabase';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { DailyIntelBar } from '@/components/DailyIntelBar';
import { LiveTicker } from '@/components/LiveTicker';

// Helper to fetch articles client-side (easier for dynamic updates/filtering demo)
async function getArticles(): Promise<DBArticle[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return null;
  }
  return data as DBArticle[];
}

export default function Home() {
  const [articles, setArticles] = useState<DBArticle[] | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticles() {
      const data = await getArticles();
      if (data === null) {
        setError("Database connection not configured.");
      } else {
        setArticles(data);
      }
    }
    loadArticles();
  }, []);

  // Unique regions from data or hardcoded
  const regions = ['All', 'Global', 'Australia/NZ', 'North America', 'Europe', 'Asia'];

  const filteredArticles = articles?.filter(a => {
    if (filterRegion === 'All') return true;
    // Handle case where region might be null in DB
    const r = a.region || 'Global';
    return r === filterRegion;
  });

  const headlineArticle = filteredArticles && filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = filteredArticles && filteredArticles.length > 1 ? filteredArticles.slice(1) : [];

  if (error) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex flex-col justify-center items-center p-8">
        <div className="max-w-md text-center bg-white p-10 border border-gray-200 shadow-sm">
          <Flame className="w-12 h-12 text-signal-red mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">System Status: Offline</h2>
          <p className="text-gray-500 mb-6">{error === "Database connection not configured." ? "Our intelligence feed is currently empty." : error}</p>
          <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded text-left overflow-x-auto">
            DEBUG: Connection to Supabase awaiting configuration.
          </div>
        </div>
      </div>
    );
  }

  if (articles === null) return (<div className="min-h-screen bg-[#f9fafb] animate-pulse" />);

  return (
    <main className="min-h-screen bg-[#f9fafb]">
      <LiveTicker />
      <Navbar />
      <DailyIntelBar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Region Filter */}
        <div className="flex justify-end mb-8 space-x-2">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest self-center mr-2">Region:</span>
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setFilterRegion(r)}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-colors ${filterRegion === r
                ? 'bg-signal-red text-white border-signal-red'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Featured Headline */}
        {/* Featured Headline */}
        {headlineArticle && (
          <section className="mb-12">
            <div className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col md:flex-row min-h-[400px]">
              <div className="absolute top-0 left-0 w-1 h-full bg-signal-red z-20 md:block hidden"></div>

              {/* Content Side */}
              <div className="flex-1 p-8 md:p-12 z-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-signal-red text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                    Top Story
                  </span>
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    {headlineArticle.category}
                  </span>
                  {headlineArticle.region && (
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest border-l pl-3 border-gray-200">
                      {headlineArticle.region}
                    </span>
                  )}
                </div>

                <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight group-hover:text-gray-700 transition-colors">
                  {headlineArticle.title}
                </h1>

                <div className="space-y-3 mb-8">
                  {headlineArticle.summary_bullets && headlineArticle.summary_bullets.map((point, i) => (
                    <p key={i} className="text-gray-600 text-lg leading-relaxed max-w-xl">
                      {(typeof point === 'string' ? point : Object.values(point || {}).join(' ')).replace(/^(The Situation|Professional Impact|Core Takeaway):/i, '').trim()}
                    </p>
                  ))}
                </div>

                <div className="flex items-center gap-6 mt-auto">
                  <a href={`/article/${headlineArticle.id}`} className="text-signal-red font-bold uppercase tracking-widest text-sm hover:underline">
                    Read Full Report →
                  </a>
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    {new Date(headlineArticle.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Image Side */}
              <div className="w-full md:w-[500px] bg-stone-200 relative min-h-[250px] md:min-h-full">
                {headlineArticle.image_url ? (
                  <img
                    src={headlineArticle.image_url}
                    alt={headlineArticle.title}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-900 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-800 to-stone-950"></div>
                    <span className="text-stone-700 font-bold uppercase tracking-[0.2em] text-sm relative z-10">FireWatch Global</span>
                  </div>
                )}
                {/* Subtle Gradient Overlay for text protection if we were doing overlay text, but here it adds depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>

            </div>
          </section>
        )}

        {/* Grid */}
        {gridArticles && gridArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p>No briefings available for this region.</p>
          </div>
        )}
      </div>
      <NewsletterSignup />
    </main>
  );
}
