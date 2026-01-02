"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { supabase, DBArticle } from '@/lib/supabase';
import Link from 'next/link';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<DBArticle[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const search = async () => {
            if (!query.trim() || !supabase) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                // Use the RPC function we just created
                const { data, error } = await supabase.rpc('search_articles', { keyword: query });
                if (error) throw error;
                setResults(data as DBArticle[]);
            } catch (e) {
                console.error("Search failed:", e);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(search, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="container mx-auto px-4 py-8 h-full flex flex-col">
                {/* Header */}
                <div className="flex justify-end mb-8">
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-8 h-8 text-gray-400 hover:text-signal-red" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative mb-12 max-w-4xl mx-auto w-full">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-300" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="SEARCH INTELLIGENCE DATABASE..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full bg-transparent border-b-4 border-gray-200 text-3xl md:text-5xl font-heading font-bold text-gray-900 placeholder:text-gray-200 py-4 pl-12 focus:outline-none focus:border-signal-red transition-colors uppercase tracking-tight"
                    />
                </div>

                {/* Results container */}
                <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full pb-20">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="w-8 h-8 text-signal-red animate-spin" />
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                                Found {results.length} Matches
                            </p>
                            {results.map(article => (
                                <Link
                                    key={article.id}
                                    href={`/article/${article.id}`}
                                    onClick={onClose}
                                    className="block group bg-white border border-gray-100 p-6 hover:border-signal-red hover:shadow-lg transition-all"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex gap-2 mb-2">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-signal-red bg-red-50 px-2 py-0.5">
                                                    {article.category}
                                                </span>
                                                {article.region && (
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-100 px-2 py-0.5">
                                                        {article.region}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-signal-red transition-colors mb-2">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm line-clamp-2">
                                                {article.summary_bullets?.[0] || 'No summary available...'}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-signal-red group-hover:translate-x-1 transition-all" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : query.trim() ? (
                        <div className="text-center py-12 text-gray-400">
                            <p>No intelligence found for "{query}"</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
