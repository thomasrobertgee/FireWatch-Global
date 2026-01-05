
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = (type: 'all' | 'essential') => {
        localStorage.setItem('cookie_consent', type);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-stone-900 text-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom border-t border-stone-800">
            <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-stone-300 text-center sm:text-left">
                    <p>
                        We use cookies to improve your experience.
                        <Link href="/legal/cookies" className="text-white hover:text-signal-red underline ml-1 transition-colors">
                            View our Cookie Policy
                        </Link> for details.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleAccept('essential')}
                        className="text-xs font-bold uppercase tracking-widest px-4 py-2 border border-stone-600 rounded hover:bg-stone-800 transition-colors"
                    >
                        Essential Only
                    </button>
                    <button
                        onClick={() => handleAccept('all')}
                        className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-signal-red text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
}
