"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Flame, Lock } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!supabase) {
            setError("Supabase client not initialized");
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-lg shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-900/20 p-3 rounded-full border border-red-900/50">
                        <Flame className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-mono text-zinc-100 text-center mb-2 tracking-tighter">FIREWATCH<span className="text-red-500">.ADMIN</span></h1>
                <p className="text-zinc-500 text-center text-xs font-mono uppercase tracking-widest mb-8">Restricted Access // Level 5</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Operative ID (Email)</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 text-sm font-mono focus:border-red-500 focus:outline-none transition-colors"
                            placeholder="agent@firewatch.global"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Passcode</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-3 text-sm font-mono focus:border-red-500 focus:outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900/20 border border-red-900/50 p-3">
                            <p className="text-red-400 text-xs font-mono flex items-center gap-2">
                                <Lock className="w-3 h-3" />
                                {error}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-mono font-bold uppercase tracking-widest py-3 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Access Control Room'}
                    </button>
                </form>
            </div>
        </div>
    );
}
