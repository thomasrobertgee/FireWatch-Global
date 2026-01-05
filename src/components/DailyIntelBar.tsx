"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Activity, Thermometer, ShieldAlert, Radio } from 'lucide-react';

interface IntelStats {
    total24h: number;
    health24h: number;
    activeZone: string;
    lastSync: Date | null;
}

export function DailyIntelBar() {
    const [stats, setStats] = useState<IntelStats | null>(null);
    const [timeDisplay, setTimeDisplay] = useState("SYNCING...");

    useEffect(() => {
        async function fetchStats() {
            if (!supabase) return;

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const dateStr = yesterday.toISOString();

            // Parallel fetch
            const [totalRes, healthRes, activeRes, lastSyncRes, scoutStatusRes] = await Promise.all([
                supabase.from('articles').select('*', { count: 'exact', head: true }).gte('created_at', dateStr),
                supabase.from('articles').select('*', { count: 'exact', head: true }).eq('category', 'Health_Research').gte('created_at', dateStr),
                supabase.from('articles').select('region').gte('created_at', dateStr),
                supabase.from('articles').select('created_at').order('created_at', { ascending: false }).limit(1),
                supabase.from('scout_status').select('last_run_at').order('last_run_at', { ascending: false }).limit(1)
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

            // Determine Last Sync (prefer scout_status, fallback to latest article)
            let lastSyncDate = null;
            if (scoutStatusRes.data && scoutStatusRes.data[0]) {
                lastSyncDate = new Date(scoutStatusRes.data[0].last_run_at);
            } else if (lastSyncRes.data && lastSyncRes.data[0]) {
                lastSyncDate = new Date(lastSyncRes.data[0].created_at);
            }

            setStats({
                total24h: totalRes.count || 0,
                health24h: healthRes.count || 0,
                activeZone,
                lastSync: lastSyncDate
            });
        }
        fetchStats();
    }, []);

    // Time Ago Logic
    useEffect(() => {
        if (!stats?.lastSync) return;

        const updateTime = () => {
            const now = new Date();
            const diffMs = now.getTime() - stats.lastSync!.getTime();
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 1) {
                setTimeDisplay("JUST NOW");
            } else if (diffMins < 60) {
                setTimeDisplay(`${diffMins}M AGO`);
            } else {
                const hours = Math.floor(diffMins / 60);
                const mins = diffMins % 60;
                setTimeDisplay(`${hours}H ${mins}M AGO`);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [stats?.lastSync]);

    if (!stats) return <div className="h-10 bg-stone-900 border-b border-signal-red animate-pulse" />;

    return (
        <div className="bg-stone-950 border-b border-signal-red text-white py-2">
            <div className="container mx-auto px-4 flex flex-wrap justify-between md:justify-center md:gap-8 gap-x-4 gap-y-2 text-[10px] md:text-xs uppercase tracking-widest font-bold">

                {/* Scout Status & Sync */}
                <div className="flex items-center gap-2 text-emerald-500">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="hidden md:inline">SCOUT ACTIVE</span>
                    <span className="text-stone-600">|</span>
                    <span className="text-stone-400">SYNC: <span className="text-white">{timeDisplay}</span></span>
                </div>

                {/* Reports */}
                <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-signal-red" />
                    <span>{stats.total24h} <span className="hidden sm:inline">REPORTS</span></span>
                </div>

                {/* Zone */}
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3 text-amber-500" />
                    <span className="hidden sm:inline">ZONE:</span>
                    <span className="text-white">{stats.activeZone}</span>
                </div>

                {/* Health */}
                <div className="flex items-center gap-2">
                    <Thermometer className="w-3 h-3 text-emerald-500" />
                    <span>{stats.health24h} <span className="hidden sm:inline">HEALTH</span></span>
                </div>

            </div>
        </div>
    );
}
