"use client";
import { useState } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Flame } from 'lucide-react';
import { SearchOverlay } from '@/components/SearchOverlay';

export function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const currentCategory = searchParams.get('category');

    const navItems = ['Operations', 'Welfare', 'Innovation', 'Environment'];
    const isBriefingsActive = pathname === '/' && !currentCategory;

    return (
        <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
                        <div className="bg-signal-red p-1.5 rounded-none">
                            <Flame className="h-6 w-6 text-white" fill="white" />
                        </div>
                        <Link href="/" className="font-heading text-2xl font-bold tracking-tight text-gray-900 group-hover:opacity-80 transition-opacity">
                            FIREWATCH <span className="text-signal-red">GLOBAL</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <div className="hidden md:flex space-x-10">
                        <Link
                            href="/"
                            className={`font-heading text-sm font-bold transition-colors uppercase tracking-wider relative ${isBriefingsActive ? 'text-signal-red' : 'text-gray-600 hover:text-signal-red'
                                }`}
                        >
                            Briefings
                            {isBriefingsActive && (
                                <span className="absolute -bottom-8 left-0 w-full h-1 bg-signal-red"></span>
                            )}
                        </Link>

                        <Link
                            href="/health-ledger"
                            className={`font-heading text-sm font-bold transition-colors uppercase tracking-wider flex items-center gap-1 relative ${pathname === '/health-ledger' ? 'text-signal-red' : 'text-gray-600 hover:text-signal-red'
                                }`}
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Health Ledger
                            {pathname === '/health-ledger' && (
                                <span className="absolute -bottom-8 left-0 w-full h-1 bg-signal-red"></span>
                            )}
                        </Link>

                        {navItems.map((item) => {
                            const isActive = currentCategory === item;
                            return (
                                <Link
                                    key={item}
                                    href={`/?category=${item}`}
                                    className={`font-heading text-sm font-bold transition-colors uppercase tracking-wider relative ${isActive ? 'text-signal-red' : 'text-gray-600 hover:text-signal-red'
                                        }`}
                                >
                                    {item}
                                    {isActive && (
                                        <span className="absolute -bottom-8 left-0 w-full h-1 bg-signal-red"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Search */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 text-gray-400 hover:text-signal-red transition-colors border border-transparent hover:border-gray-200 rounded-none"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
