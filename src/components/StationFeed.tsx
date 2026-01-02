"use client";

import { useEffect, useState } from 'react';
import { fetchLocalWeather, WeatherData } from '@/services/weatherService';
import { getUserLocation } from '@/lib/location';
import { AlertTriangle, Wind, Thermometer, Droplets, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Colors for ratings
const RATING_COLORS: Record<string, string> = {
    "Moderate": "bg-emerald-500",
    "High": "bg-yellow-500",
    "Extreme": "bg-orange-600",
    "Catastrophic": "bg-signal-red"
};

export function StationFeed() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [localBriefs, setLocalBriefs] = useState<any[]>([]);

    useEffect(() => {
        async function initFeed() {
            try {
                // 1. Get Location
                const coords = await getUserLocation();

                // 2. Get Weather
                const w = await fetchLocalWeather(coords.lat, coords.lon);
                setWeather(w);

                // 3. Get Local Briefs (filtering by implicit region logic or just showing global for demo if region mapping is complex)
                // For MVP, we'll try to guess region or just show "Global" + Filter
                // Actually, since we don't have a reliable lat/lon -> 'Australia/NZ' mapper yet without another API,
                // we will query for ALL articles but label them 'Local Area' if they match broad patterns or just show latest 3.
                // Or better: filter by the user's IP region if we implemented that.
                // For this component, we'll just fetch the latest 3 articles as "Recent Incidents" for now 
                // but if the user is in Australia (lat -10 to -45, lon 110 to 155), we filter 'Australia/NZ'.

                let regionFilter: string | null = null;
                if (coords.lat < -10 && coords.lat > -45 && coords.lon > 110 && coords.lon < 160) {
                    regionFilter = 'Australia/NZ';
                }
                // (Add other bounding boxes as needed)

                let query = supabase!.from('articles').select('*').limit(3).order('created_at', { ascending: false });
                if (regionFilter) {
                    query = query.eq('region', regionFilter);
                }

                const { data } = await query;
                setLocalBriefs(data || []);

            } catch (err) {
                console.error(err);
                setError("Location access denied or unavailable.");
            } finally {
                setLoading(false);
            }
        }

        initFeed();
    }, []);

    if (loading) return (
        <div className="bg-white border border-gray-200 p-6 shadow-sm h-full flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 text-signal-red animate-spin mb-3" />
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Locating Station...</p>
        </div>
    );

    if (error || !weather) return (
        <div className="bg-stone-100 border border-stone-200 p-6 shadow-sm h-full flex flex-col items-center justify-center text-center">
            <MapPin className="w-8 h-8 text-stone-400 mb-3" />
            <p className="text-stone-500 text-sm font-bold mb-2">Station Feed Unavailable</p>
            <p className="text-stone-400 text-xs">{error || "Could not fetch local data."}</p>
        </div>
    );

    const ratingColor = RATING_COLORS[weather.fireDangerRating] || "bg-gray-400";

    return (
        <div className="space-y-6">

            {/* 1. Fire Danger Gauge */}
            <div className="bg-stone-900 text-white p-6 shadow-md border-t-4 border-signal-red relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Fire Danger Rating</span>
                        <AlertTriangle className="w-4 h-4 text-signal-red" />
                    </div>

                    <h2 className={`font-heading text-3xl font-bold mb-1 ${weather.fireDangerRating === 'Catastrophic' ? 'text-signal-red' : 'text-white'}`}>
                        {weather.fireDangerRating.toUpperCase()}
                    </h2>

                    <div className="w-full bg-stone-800 h-2 mt-4 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${ratingColor} transition-all duration-1000 ease-out`}
                            style={{ width: `${Math.min(weather.fireDangerIndex, 100)}%` }}
                        />
                    </div>
                    <p className="text-right text-[10px] text-stone-500 mt-1 font-mono">FDI: {weather.fireDangerIndex.toFixed(0)}</p>
                </div>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Wind className="w-32 h-32" />
                </div>
            </div>

            {/* 2. Weather Telemetry */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                    <MapPin className="w-4 h-4 text-signal-red" />
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{weather.locationName} Station</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stone-50 p-3 rounded border border-stone-100">
                        <div className="flex items-center gap-2 text-stone-400 mb-1">
                            <Thermometer className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">Temp</span>
                        </div>
                        <span className="text-xl font-bold text-stone-800">{weather.temp.toFixed(1)}°C</span>
                    </div>

                    <div className="bg-stone-50 p-3 rounded border border-stone-100">
                        <div className="flex items-center gap-2 text-stone-400 mb-1">
                            <Droplets className="w-3 h-3" />
                            <span className="text-[10px] font-bold uppercase">Humidity</span>
                        </div>
                        <span className="text-xl font-bold text-stone-800">{weather.humidity}%</span>
                    </div>

                    <div className="col-span-2 bg-stone-50 p-3 rounded border border-stone-100 flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2 text-stone-400 mb-1">
                                <Wind className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase">Wind</span>
                            </div>
                            <span className="text-xl font-bold text-stone-800">{weather.windSpeed.toFixed(1)} km/h</span>
                        </div>
                        <div className="text-right">
                            <div className="w-8 h-8 rounded-full border-2 border-stone-300 flex items-center justify-center relative bg-white" style={{ transform: `rotate(${weather.windDeg}deg)` }}>
                                <span className="text-[8px] font-bold text-signal-red">▲</span>
                            </div>
                            <span className="text-[9px] text-stone-400 font-bold mt-1 block uppercase">{getCardinalDirection(weather.windDeg)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Local Incident Feed */}
            {localBriefs.length > 0 && (
                <div className="bg-white border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 pb-2 border-b border-gray-100">
                        Recent Incidents
                    </h3>
                    <div className="space-y-4">
                        {localBriefs.map(article => (
                            <a key={article.id} href={`/article/${article.id}`} className="block group">
                                <span className="text-[9px] text-signal-red font-bold uppercase block mb-1">
                                    {article.category}
                                </span>
                                <h4 className="text-sm font-bold text-gray-800 leading-tight group-hover:text-signal-red transition-colors mb-1">
                                    {article.title}
                                </h4>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(article.created_at).toLocaleDateString()}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

function getCardinalDirection(angle: number) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(angle / 45) % 8];
}
