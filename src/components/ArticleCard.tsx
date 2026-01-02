import Link from 'next/link';
import { ArrowUpRight, Globe, MapPin, Clock } from 'lucide-react';
import { DBArticle } from '@/lib/supabase';

interface ArticleCardProps {
    article: DBArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
    const isGlobal = article.region === 'Global';

    // Format date
    const date = new Date(article.created_at);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    return (
        <Link href={`/article/${article.id}`} className="group block h-full">
            <div className="h-full border border-gray-200 bg-white hover:border-signal-red transition-all duration-300 flex flex-col justify-between relative shadow-sm hover:shadow-md overflow-hidden">

                {/* Image Section */}
                <div className="aspect-video w-full bg-stone-200 relative overflow-hidden">
                    {article.image_url ? (
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-stone-800">
                            <span className="text-stone-600 font-bold uppercase tracking-widest text-xs">FireWatch Global</span>
                        </div>
                    )}

                    {/* Timestamp Overlay */}
                    <div className="absolute bottom-0 left-0 bg-black/70 backdrop-blur-sm px-3 py-1 flex items-center gap-2 text-[10px] text-white font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3 text-signal-red" />
                        <span>{dateStr}, {timeStr}</span>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                            {/* ... existing badges ... */}
                            <span className="inline-block bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-none">
                                {article.category}
                            </span>
                            {article.region && (
                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-none">
                                    {isGlobal ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                    {article.region}
                                </span>
                            )}
                        </div>

                        <ArrowUpRight className="h-5 w-5 text-gray-300 group-hover:text-signal-red transition-colors" />
                    </div>

                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-3 group-hover:text-signal-red transition-colors leading-tight">
                        {article.title}
                    </h3>

                    <div className="space-y-2 mb-4 flex-grow">
                        <p className="text-gray-600 text-sm leading-relaxed border-l-2 border-gray-100 pl-3 line-clamp-3">
                            {(() => {
                                const bullet = article.summary_bullets?.[0];
                                if (!bullet) return 'No summary available';
                                let content = '';
                                if (typeof bullet === 'string') content = bullet;
                                else if (typeof bullet === 'object') {
                                    const values = Object.values(bullet);
                                    content = String(values[0] || JSON.stringify(bullet));
                                } else {
                                    content = String(bullet);
                                }
                                return content.replace(/^(The Situation|Professional Impact|Core Takeaway):/i, '').trim();
                            })()}
                        </p>
                    </div>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                            {article.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-[9px] uppercase font-bold text-gray-400 border border-gray-100 px-1 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400 font-sans uppercase tracking-wider">
                        <span>Read Brief</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
