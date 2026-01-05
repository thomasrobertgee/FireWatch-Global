import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Clock, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import { DailyIntelBar } from '@/components/DailyIntelBar';
import { supabase, DBArticle } from '@/lib/supabase';
import { Footer } from '@/components/Footer';

// Helper to fetch article (no-cache for freshness or simple cache)
async function getArticle(slug: string): Promise<DBArticle | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error("Error fetching article:", error);
        return null;
    }
    return data;
}

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const article = await getArticle(slug);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white pb-20">
            <Navbar />
            <DailyIntelBar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 4. Navigation */}
                <Link href="/" className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-signal-red uppercase tracking-widest mb-8 transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                </Link>

                <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Header Image Section */}
                    <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden shadow-sm bg-stone-200 group">
                        {article.image_url ? (
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-stone-800">
                                <span className="text-stone-600 font-bold uppercase tracking-widest">FireWatch Global</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Overlay Metadata */}
                        <div className="absolute bottom-6 left-6 md:left-10 text-white">
                            <div className="flex gap-2 mb-3">
                                <span className="bg-signal-red px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                                    {article.category}
                                </span>
                                {article.region && (
                                    <span className="bg-white/20 backdrop-blur-sm px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                                        {article.region}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-200">
                                <span className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(article.created_at).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {new Date(article.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="max-w-3xl mx-auto">
                        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-8">
                            {article.title}
                        </h1>

                        {/* AI Summary Section */}
                        <div className="bg-gray-50 border border-gray-100 p-8 rounded-sm mb-10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-signal-red"></div>
                            <h3 className="font-heading text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-signal-red animate-pulse"></span>
                                AI Summary
                            </h3>

                            <div className="space-y-6">
                                {article.full_summary && article.full_summary.length > 0 ? (
                                    article.full_summary.map((para, i) => (
                                        <p key={i} className="text-gray-700 font-sans text-lg leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:text-signal-red first-letter:mr-1 first-letter:float-left">
                                            {para}
                                        </p>
                                    ))
                                ) : article.summary_bullets && article.summary_bullets.length > 0 ? (
                                    article.summary_bullets.map((point, i) => (
                                        <div key={i} className="flex gap-4">
                                            <span className="text-signal-red font-bold text-lg leading-none mt-1">•</span>
                                            <p className="text-gray-700 font-sans text-base leading-relaxed">
                                                {(typeof point === 'string' ? point : Object.values(point || {}).join(' ')).replace(/^(The Situation|Professional Impact|Core Takeaway|Methodology|Findings):/i, '').trim()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">Analysis pending...</p>
                                )}
                            </div>
                        </div>

                        {/* Full Content (Optional Fallback) */}
                        {/* if we had full body text it would go here, maybe user wants to read snippet */}



                        {/* Source Link */}
                        <div className="flex justify-center border-t border-gray-100 pt-10">
                            <a
                                href={article.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 bg-white border-2 border-gray-900 text-gray-900 px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg"
                            >
                                Read Full Original Report at {article.source_name || "Source"}
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>

                        {/* Takedown Request */}
                        <div className="mt-12 text-center border-t border-gray-50 pt-8">
                            <a href={`mailto:legal@firewatch.global?subject=Takedown Request: ${article.title}`} className="text-gray-400 text-xs hover:text-signal-red transition-colors uppercase tracking-widest font-bold">
                                Report an Issue / Takedown Request
                            </a>
                        </div>
                    </div>

                </article>
            </div>
            <Footer />
        </main>
    );
}
