"use client";

import { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';

export function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error === 'Failed to subscribe') { // Assuming unique constraint error might be hidden or mapped
                    // For simpler UX, we'll just show the error message returned or generic
                }
                setStatus('error');
                setMsg(data.error || 'Something went wrong.');
            } else {
                setStatus('success');
                setMsg(data.message || 'Welcome to the brotherhood.');
                setEmail('');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMsg('Network error. Try again.');
        }
    };

    return (
        <section className="bg-stone-900 py-16 text-white border-t border-signal-red">
            <div className="container mx-auto px-4 text-center max-w-xl">
                <Mail className="w-8 h-8 mx-auto mb-4 text-signal-red" />
                <h2 className="text-2xl font-heading font-bold mb-2 tracking-wide">Command Center Briefing</h2>
                <p className="text-stone-400 mb-8 italic">"Intelligence delivered at shift change. 0700 hours."</p>

                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-stone-800 border border-stone-700 text-white px-4 py-3 focus:outline-none focus:border-signal-red transition-colors placeholder:text-stone-600"
                        required
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="bg-signal-red text-white font-bold uppercase tracking-widest px-6 py-3 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin w-4 h-4" /> :
                            status === 'success' ? <CheckCircle className="w-4 h-4" /> : 'Join'}
                        {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined' : ''}
                    </button>
                </form>
                {msg && <p className={`mt-4 text-sm font-bold ${status === 'error' ? 'text-red-400' : 'text-emerald-400'}`}>{msg}</p>}
            </div>
        </section>
    );
}
