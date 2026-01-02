import { articles } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function ArticlePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const article = articles.find((a) => a.id === id);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/" className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-signal-red uppercase tracking-widest mb-10 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Intelligence
                </Link>

                <article>
                    <div className="mb-10">
                        <span className="inline-block bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-widest px-3 py-1 mb-6">
                            {article.category}
                        </span>
                        <h1 className="font-heading text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-8">
                            {article.title}
                        </h1>
                        <div className="h-1 w-24 bg-signal-red"></div>
                    </div>

                    <div className="max-w-none text-gray-700 font-serif leading-relaxed text-lg">
                        <div className="bg-gray-50 p-8 md:p-10 mb-8 border border-gray-100 shadow-sm">
                            <h3 className="font-heading text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">
                                Executive Summary
                            </h3>
                            <ul className="space-y-6 list-none pl-0 mt-0">
                                {article.summary.map((point, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <span className="text-signal-red font-bold mt-1.5 text-xs">■</span>
                                        <div>{point}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <span className="text-gray-400 text-xs font-bold font-sans uppercase tracking-widest block mb-2">Primary Source</span>
                            <a
                                href={article.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-heading text-xl font-bold text-gray-900 hover:text-signal-red transition-colors flex items-center gap-2 group"
                            >
                                {article.source} <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-signal-red transition-colors" />
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
}
