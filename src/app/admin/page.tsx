"use client";
import { useEffect, useState } from 'react';
import { supabase, DBArticle } from '@/lib/supabase';
import { Flame, Users, Radio, Trash2, Star, Play, AlertTriangle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Subscriber {
    id: string;
    email: string;
    created_at: string;
}

export default function AdminDashboard() {
    const [articles, setArticles] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [scraping, setScraping] = useState(false);
    const [scrapeStatus, setScrapeStatus] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        fetchData();
        setupRealtime();
    }, []);

    const fetchData = async () => {
        if (!supabase) return;

        // Fetch Articles
        const { data: artData } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (artData) setArticles(artData);

        // Fetch Subscribers
        const { data: subData } = await supabase
            .from('subscribers')
            .select('*');

        if (subData) setSubscribers(subData);

        setLoading(false);
    };

    const setupRealtime = () => {
        // Optional: Listen for db changes
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to burn this record?')) return;

        const res = await fetch(`/api/admin/article/delete?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setArticles(articles.filter(a => a.id !== id));
        } else {
            alert('Failed to delete');
        }
    };

    const toggleFeature = async (id: string, currentStatus: boolean) => {
        // Optimistic UI Update
        const newStatus = !currentStatus;
        setArticles(articles.map(a => a.id === id ? { ...a, is_featured: newStatus } : a));

        const res = await fetch('/api/admin/article/toggle', {
            method: 'POST',
            body: JSON.stringify({ id, is_featured: newStatus })
        });

        if (!res.ok) {
            // Revert on failure
            setArticles(articles.map(a => a.id === id ? { ...a, is_featured: currentStatus } : a));
            alert('Failed to update feature status');
        }
    };

    const runScraper = async () => {
        setScraping(true);
        setScrapeStatus("In Progress...");

        try {
            const res = await fetch('/api/admin/trigger-scout', { method: 'POST' });
            if (res.ok) {
                setScrapeStatus("Scout Agent Returned Successfully.");
                fetchData(); // Refresh data
            } else {
                setScrapeStatus("Scout Agent Failed.");
            }
        } catch (e) {
            setScrapeStatus("Connection Error.");
        } finally {
            setScraping(false);
            setTimeout(() => setScrapeStatus(null), 3000);
        }
    };

    const logout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    if (loading) return <div className="p-10 font-mono text-zinc-500">Loading Intelligence...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-end mb-10 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-mono text-zinc-100 tracking-tighter flex items-center gap-3">
                        <Flame className="text-red-500 w-8 h-8" />
                        MISSION CONTROL
                    </h1>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-2 ml-1">FireWatch Global // Admin Node</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={logout} className="text-xs font-mono text-zinc-500 hover:text-white uppercase">Log Out</button>
                    <div className="text-xs font-mono text-red-500 border border-red-900/50 bg-red-900/10 px-3 py-1 rounded-full animate-pulse">
                        LIVE CONNECTION
                    </div>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                {/* Stat 1 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-mono text-zinc-500 text-xs uppercase tracking-widest">Total Intelligence</h3>
                        <Radio className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-4xl font-mono text-zinc-100">{articles.length}</div>
                    <div className="text-xs font-mono text-zinc-600 mt-2">Cached Articles</div>
                </div>

                {/* Stat 2 */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-mono text-zinc-500 text-xs uppercase tracking-widest">Subscribers</h3>
                        <Users className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-4xl font-mono text-zinc-100">{subscribers.length}</div>
                    <div className="text-xs font-mono text-zinc-600 mt-2">Active Recipients</div>
                </div>

                {/* Actions */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <h3 className="font-mono text-zinc-500 text-xs uppercase tracking-widest">Scout Agent</h3>
                        <AlertTriangle className={`w-4 h-4 ${scraping ? 'text-yellow-500 animate-bounce' : 'text-zinc-700'}`} />
                    </div>
                    <div>
                        <button
                            onClick={runScraper}
                            disabled={scraping}
                            className={`w-full font-mono text-xs font-bold uppercase tracking-widest py-3 border transition-colors flex items-center justify-center gap-2
                                ${scraping
                                    ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-wait'
                                    : 'bg-emerald-900/20 text-emerald-500 border-emerald-900/50 hover:bg-emerald-900/40'
                                }`}
                        >
                            {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            {scraping ? 'AGENT DEPLOYED...' : 'RUN SCOUT AGENT'}
                        </button>
                        {scrapeStatus && <p className="text-center font-mono text-[10px] text-zinc-400 mt-2">{scrapeStatus}</p>}
                    </div>
                </div>
            </div>

            {/* Articles Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <h3 className="font-mono text-zinc-400 text-sm uppercase tracking-widest">Article Log</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-950/50">
                                <th className="p-4 font-mono text-xs text-zinc-500 uppercase tracking-wider w-12">Feat.</th>
                                <th className="p-4 font-mono text-xs text-zinc-500 uppercase tracking-wider">Title / Slug</th>
                                <th className="p-4 font-mono text-xs text-zinc-500 uppercase tracking-wider">Category</th>
                                <th className="p-4 font-mono text-xs text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {articles.map(article => (
                                <tr key={article.id} className="hover:bg-zinc-800/50 transition-colors group">
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => toggleFeature(article.id, article.is_featured)}
                                            className={`p-1 rounded hover:bg-zinc-700 transition-colors ${article.is_featured ? 'text-yellow-400' : 'text-zinc-700 group-hover:text-zinc-500'}`}
                                        >
                                            <Star className="w-4 h-4" fill={article.is_featured ? "currentColor" : "none"} />
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-semibold text-zinc-300 text-sm line-clamp-1">{article.title}</div>
                                        <div className="font-mono text-xs text-zinc-600 truncate max-w-[300px]">{article.slug}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-mono text-xs text-zinc-500 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded">
                                            {article.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="text-zinc-600 hover:text-red-500 transition-colors p-2"
                                            title="Delete Article"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
