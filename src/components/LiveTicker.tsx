"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function LiveTicker() {
    const [stats, setStats] = useState({
        lastSync: null as Date | null,
        count24h: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!supabase) return;

            const yesterday = new Date();
            yesterday.setHours(yesterday.getHours() - 24);

            // 1. Get 24h Count
            const { count } = await supabase
                .from('articles')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', yesterday.toISOString());

            // 2. Get Last Sync (latest article)
            const { data } = await supabase
                .from('articles')
                .select('created_at')
                .order('created_at', { ascending: false })
                .limit(1);

            if (data && data[0]) {
                setStats({
                    lastSync: new Date(data[0].created_at),
                    count24h: count || 0
                });
            }
        };

        fetchStats();
        // Refresh every minute
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    // Minute Ticker Logic
    const [timeDisplay, setTimeDisplay] = useState("SYNCING...");

    useEffect(() => {
        if (!stats.lastSync) return;

        const updateTime = () => {
            const now = new Date();
            const diffMs = now.getTime() - stats.lastSync!.getTime();
            const diffMins = Math.floor(diffMs / 60000);

            if (diffMins < 1) {
                setTimeDisplay("JUST NOW");
            } else if (diffMins < 60) {
                setTimeDisplay(`${diffMins} MINS AGO`);
            } else {
                const hours = Math.floor(diffMins / 60);
                const mins = diffMins % 60;
                setTimeDisplay(`${hours} HOURS, ${mins} MINS AGO`);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 10000); // Check every 10s for display update
        return () => clearInterval(interval);
    }, [stats.lastSync]);

    return (
        <div className="bg-stone-950 text-white text-[10px] font-bold uppercase tracking-[0.2em] py-2 border-b border-stone-800">
            <div className="container mx-auto px-4 flex justify-between items-center">

                {/* Left: Status */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-emerald-500">Scout Status: Active</span>
                    </div>
                    <span className="text-stone-600 hidden sm:inline">|</span>
                    <div className="hidden sm:block">
                        <span className="text-stone-400">Last Sync: </span>
                        <span className="text-white">{timeDisplay}</span>
                    </div>
                </div>

                {/* Right: Count */}
                <div className="flex items-center gap-2">
                    <span className="text-stone-400">24H Intel:</span>
                    <span className="text-signal-red">{stats.count24h} Briefings</span>
                </div>

            </div>

            {/* Mobile Only Line for Time to save space on top row if needed */}
            <div className="sm:hidden text-center mt-1 border-t border-stone-900 pt-1">
                <span className="text-stone-400">Sync: </span>
                <span className="text-white">{timeDisplay}</span>
            </div>
        </div>
    );
}
