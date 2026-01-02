"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity, Thermometer, ShieldAlert } from 'lucide-react';

interface IntelStats {
    total24h: number;
    health24h: number;
    activeZone: string;
}

export function DailyIntelBar() {
    const [stats, setStats] = useState<IntelStats | null>(null);

    useEffect(() => {
        async function fetchStats() {
            if (!supabase) return;

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const dateStr = yesterday.toISOString();

            // Parallel fetch
            const [totalRes, healthRes, activeRes] = await Promise.all([
                supabase.from('articles').select('*', { count: 'exact', head: true }).gte('created_at', dateStr),
                supabase.from('articles').select('*', { count: 'exact', head: true }).eq('category', 'Health_Research').gte('created_at', dateStr),
                supabase.from('articles').select('region').gte('created_at', dateStr)
            ]);

            let activeZone = 'Global';
            if (activeRes.data && activeRes.data.length > 0) {
                const counts: Record<string, number> = {};
                activeRes.data.forEach(a => {
                    const r = a.region || 'Global';
                    counts[r] = (counts[r] || 0) + 1;
                });
                activeZone = Object.entries(counts).reduce((a, b) => a[1] > b[1] ? a : b)[0];
            }

            setStats({
                total24h: totalRes.count || 0,
                health24h: healthRes.count || 0,
                activeZone
            });
        }
        fetchStats();
    }, []);

    if (!stats) return <div className="h-12 bg-stone-100 border-b border-gray-200 animate-pulse" />;

    return (
        <div className="bg-stone-900 border-b border-signal-red text-white py-3">
            <div className="container mx-auto px-4 flex flex-wrap justify-center md:justify-around gap-4 md:gap-8 text-sm uppercase tracking-widest font-bold">

                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-signal-red" />
                    <span>{stats.total24h} New Reports (24h)</span>
                </div>

                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>Active Zone: <span className="text-white">{stats.activeZone}</span></span>
                </div>

                <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-emerald-500" />
                    <span>{stats.health24h} Health Studies</span>
                </div>

            </div>
        </div>
    );
}
