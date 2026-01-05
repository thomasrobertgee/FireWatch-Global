"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArticleCard } from '@/components/ArticleCard';
import { Navbar } from '@/components/Navbar';
import { Flame, Clock, ArrowUpRight } from 'lucide-react';
import { supabase, DBArticle } from '@/lib/supabase';
import { NewsletterSignup } from '@/components/NewsletterSignup';
import { DailyIntelBar } from '@/components/DailyIntelBar';
import { StationFeed } from '@/components/StationFeed';
import { CategoryHeader } from '@/components/CategoryHeader';
import { Footer } from '@/components/Footer';

// Helper to fetch articles client-side (easier for dynamic updates/filtering demo)
async function getArticles(category: string, region: string, page: number): Promise<DBArticle[] | null> {
  if (!supabase) return null;

  const PAGE_SIZE = 12;
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('articles')
    .select('*')
    .order('is_featured', { ascending: false }) // Featured first
    .order('created_at', { ascending: false })  // Then newest
    .range(from, to);

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  if (region && region !== 'All') {
    query = query.eq('region', region);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching articles:', error);
    return null;
  }
  return data as DBArticle[];
}

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function HomeContent() {
  const [articles, setArticles] = useState<DBArticle[] | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const categoryParams = searchParams.get('category');
  const activeCategory = categoryParams || 'All';

  // Initial Load (Category or Region change)
  useEffect(() => {
    async function loadArticles() {
      setPage(0);
      setHasMore(true);
      setArticles(null); // Reset to show loading skeleton

      const data = await getArticles(activeCategory, filterRegion, 0);

      if (data === null) {
        setError("Database connection not configured.");
      } else {
        setArticles(data);
        if (data.length < 12) setHasMore(false);
      }
    }
    loadArticles();
  }, [activeCategory, filterRegion]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    const nextPage = page + 1;
    const newData = await getArticles(activeCategory, filterRegion, nextPage);

    if (newData) {
      if (newData.length < 12) setHasMore(false);
      setArticles(prev => [...(prev || []), ...newData]);
      setPage(nextPage);
    }

    setLoadingMore(false);
  };

  // Unique regions from data or hardcoded
  const regions = ['All', 'Global', 'Australia/NZ', 'North America', 'Europe', 'Asia'];

  // Note: We no longer filter client-side, the DB does it.
  // Except for the Headline separation which is purely visual.

  const headlineArticle = articles && articles.length > 0 ? articles[0] : null;
  const gridArticles = articles && articles.length > 1 ? articles.slice(1) : [];

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
      <Navbar />
      <DailyIntelBar />

      {['Operations', 'Welfare', 'Innovation', 'Environment'].includes(activeCategory) && (
        <CategoryHeader category={activeCategory} />
      )}

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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Content (Articles) - Spans 3 columns */}
          <div className="lg:col-span-3">
            {/* Featured Headline */}
            {headlineArticle && (
              <section className="mb-12">
                <a href={`/article/${headlineArticle.slug || headlineArticle.id}`} className="group block h-[500px] border border-gray-200 bg-white hover:border-signal-red transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden">
                  <div className="flex flex-col md:flex-row h-full">

                    {/* Top Border Accent */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-signal-red z-20 md:block hidden"></div>

                    {/* Content Side */}
                    <div className="flex-1 flex flex-col z-10 h-full">

                      {/* Top Half: Meta + Title */}
                      <div className="flex-1 p-8 md:px-10 md:pt-10 md:pb-2 flex flex-col justify-start">
                        <div className="flex items-center gap-3 mb-4">
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

                        <h1 className="font-heading text-2xl md:text-4xl font-bold text-gray-900 leading-tight group-hover:text-signal-red transition-colors line-clamp-3">
                          {headlineArticle.title}
                        </h1>
                      </div>

                      {/* Bottom Half: Summary + Footer */}
                      <div className="flex-1 p-8 md:px-10 md:pb-10 md:pt-2 flex flex-col justify-end">
                        <div className="space-y-3 mb-6 overflow-hidden">
                          {headlineArticle.summary_bullets && headlineArticle.summary_bullets.map((point, i) => (
                            <p key={i} className="text-gray-600 text-base leading-relaxed max-w-xl line-clamp-2">
                              {(typeof point === 'string' ? point : Object.values(point || {}).join(' ')).replace(/^(The Situation|Professional Impact|Core Takeaway|Methodology|Findings):/i, '').trim()}
                            </p>
                          ))}
                        </div>

                        <div className="flex items-center gap-6 mt-auto border-t border-gray-100 pt-6">
                          <span className="text-signal-red font-bold uppercase tracking-widest text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                            Read Full Report <ArrowUpRight className="w-4 h-4" />
                          </span>
                          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-auto">
                            <Clock className="w-3 h-3" />
                            {new Date(headlineArticle.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Side - Fixed Height/Width or Ratio */}
                    <div className="w-full md:w-[500px] bg-stone-200 relative min-h-[200px] md:h-full overflow-hidden">
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
                      {/* Overlay for aesthetic */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>

                  </div>
                </a>
              </section>
            )}

            {/* Grid */}
            {gridArticles && gridArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {gridArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p>No briefings available for this region.</p>
              </div>
            )}

            {/* Load More Button */}
            <div className="mt-12 text-center">
              {loadingMore ? (
                <div className="flex items-center justify-center gap-2 text-stone-500 text-sm font-bold uppercase tracking-widest">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scouting for more briefings...
                </div>
              ) : hasMore ? (
                <button
                  onClick={handleLoadMore}
                  className="bg-white border-2 border-stone-200 text-stone-600 px-8 py-3 text-xs font-bold uppercase tracking-widest hover:border-signal-red hover:text-signal-red transition-all uppercase tracking-widest"
                >
                  Load More Operations
                </button>
              ) : (
                <span className="text-stone-400 text-xs font-bold uppercase tracking-widest border-t border-stone-200 pt-4 px-4">
                  End of Feed
                </span>
              )}
            </div>
          </div>

          {/* Right Sidebar (Station Feed) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h3 className="font-heading text-lg font-bold text-gray-900 mb-4 border-b-2 border-signal-red inline-block pb-1">
                My Station Feed
              </h3>
              <StationFeed />
            </div>
          </div>

        </div>
      </div>
      <NewsletterSignup />
      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f9fafb] animate-pulse" />}>
      <HomeContent />
    </Suspense>
  );
}
