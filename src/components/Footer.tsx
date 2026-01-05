
import Link from 'next/link';
import { Flame } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-stone-900 text-white border-t border-stone-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="bg-signal-red p-1.5 rounded-sm group-hover:bg-red-600 transition-colors">
                                <Flame className="w-5 h-5 text-white fill-white" />
                            </div>
                            <span className="font-heading text-lg font-bold tracking-tight text-white group-hover:text-gray-200 transition-colors">
                                FIREWATCH <span className="text-signal-red">GLOBAL</span>
                            </span>
                        </Link>
                        <p className="text-stone-400 text-sm leading-relaxed mb-6">
                            The premier intelligence portal for fire service professionals, delivering real-time operations, welfare, and innovation briefs from around the globe.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Intelligence</h4>
                        <ul className="space-y-4 text-sm text-stone-400">
                            <li><Link href="/?category=Operations" className="hover:text-signal-red transition-colors">Operations</Link></li>
                            <li><Link href="/?category=Welfare" className="hover:text-signal-red transition-colors">Welfare & Legal</Link></li>
                            <li><Link href="/?category=Innovation" className="hover:text-signal-red transition-colors">Tech & Innovation</Link></li>
                            <li><Link href="/?category=Environment" className="hover:text-signal-red transition-colors">Environment</Link></li>
                        </ul>
                    </div>

                    {/* Special */}
                    <div>
                        <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Special Units</h4>
                        <ul className="space-y-4 text-sm text-stone-400">
                            <li><Link href="/health-ledger" className="hover:text-emerald-400 transition-colors">The Health Ledger</Link></li>
                            <li><Link href="#" className="hover:text-signal-red transition-colors">Station Command</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="font-bold text-white uppercase tracking-widest text-xs mb-6">Legal & Support</h4>
                        <ul className="space-y-4 text-sm text-stone-400">
                            <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-white transition-colors">Copyright & DMCA</Link></li>
                            <li><a href="mailto:legal@firewatch.global" className="hover:text-white transition-colors">Report Issue</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-mono">
                    <p>© 2026 FireWatch Global. All rights reserved.</p>
                    <p>Original news content and trademarks are property of their respective owners.</p>
                </div>
            </div>
        </footer>
    );
}
