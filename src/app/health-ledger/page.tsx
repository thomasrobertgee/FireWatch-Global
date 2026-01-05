"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { supabase, DBArticle } from '@/lib/supabase';
import { FileText, Award, ExternalLink, Activity } from 'lucide-react';
import { DailyIntelBar } from '@/components/DailyIntelBar';
import { GlossaryText } from '@/components/GlossaryText';
import { CategoryHeader } from '@/components/CategoryHeader';

async function getHealthArticles(): Promise<DBArticle[] | null> {
    if (!supabase) return null;
    const { data, error } = await supabase
        .from('articles')
        .select('*')
        // Filter by the special tag/category we will use
        .eq('category', 'Health_Research')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching health articles:', error);
        return null;
    }
    return data as DBArticle[];
}

export default function HealthLedger() {
    const [articles, setArticles] = useState<DBArticle[] | null>(null);

    useEffect(() => {
        async function load() {
            const data = await getHealthArticles();
            if (data) setArticles(data);
        }
        load();
    }, []);

    if (!articles) return <div className="min-h-screen bg-stone-50 animate-pulse" />;

    return (
        <main className="min-h-screen bg-stone-50 font-serif text-stone-900">
            <Navbar />
            <DailyIntelBar />

            <CategoryHeader category="Health Ledger" />

            <div className="container mx-auto px-4 py-12 max-w-3xl">
                {articles.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-stone-200 rounded shadow-sm">
                        <p className="text-stone-500 text-lg">Awaiting Peer-Reviewed Data Sync...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {articles.map((article) => (
                            <article key={article.id} className="bg-white border-l-4 border-emerald-600 p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-stone-100 text-stone-600 px-3 py-1 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Award className="w-3 h-3 text-emerald-600" />
                                        Peer-Reviewed Source
                                    </span>
                                    {article.region && (
                                        <span className="text-stone-400 text-xs uppercase font-bold">
                                            {article.region}
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-2xl font-bold text-stone-900 mb-6 leading-tight hover:text-emerald-800 transition-colors">
                                    <a href={article.source_url} target="_blank" rel="noreferrer">
                                        {article.title}
                                    </a>
                                </h2>

                                <div className="space-y-4 mb-8">
                                    {article.summary_bullets && article.summary_bullets.map((point, i) => {
                                        // Simple heuristic to split headers if they exist in the format "Header: Content"
                                        const [header, ...content] = point.split(':');
                                        return (
                                            <div key={i} className="flex flex-col md:flex-row gap-2 md:gap-4">
                                                <dt className="w-full md:w-48 flex-shrink-0 text-sm font-bold text-emerald-900 uppercase tracking-wide pt-1">
                                                    {header}
                                                </dt>
                                                <dd className="flex-1 text-stone-700 leading-relaxed border-l-2 border-stone-100 pl-4 md:border-0 md:pl-0">
                                                    <GlossaryText text={content.join(':')} />
                                                </dd>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex justify-between items-end border-t border-stone-100 pt-6">
                                    <div className="flex gap-2">
                                        {article.tags?.map(tag => (
                                            <span key={tag} className="text-[10px] text-stone-400 border border-stone-200 px-2 py-0.5 rounded-full uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <a
                                        href={article.source_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-emerald-700 text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:underline"
                                    >
                                        Digital Object Identifier <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
