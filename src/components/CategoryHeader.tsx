import { Shield, Heart, Cpu, Activity, Info, Leaf } from 'lucide-react';

interface CategoryHeaderProps {
    category: string;
}

const CATEGORY_CONFIG: Record<string, { title: string; description: string; icon: any; color: string }> = {
    'Operations': {
        title: 'Mission Intelligence',
        description: 'Real-time tactical updates and global incident reports.',
        icon: Shield,
        color: 'text-blue-700' // Example color, can adjust
    },
    'Welfare': {
        title: 'The Personnel File',
        description: 'Pay, mental health, and legislative support for the front line.',
        icon: Heart,
        color: 'text-rose-600'
    },
    'Innovation': {
        title: 'Future Force',
        description: 'Next-gen equipment, drone tech, and firefighting breakthroughs.',
        icon: Cpu,
        color: 'text-indigo-600'
    },
    'Health Ledger': {
        title: 'The Health Ledger',
        description: '"Occupational risks, peer-reviewed findings, and long-term welfare analysis."',
        icon: Activity,
        color: 'text-emerald-700'
    },
    'Environment': {
        title: 'Environmental Watch',
        description: 'Wildfire tracking, climate impact reports, and ecological preservation.',
        icon: Leaf,
        color: 'text-green-600'
    }
};

export function CategoryHeader({ category }: CategoryHeaderProps) {
    const config = CATEGORY_CONFIG[category] || {
        title: category,
        description: 'Latest updates and briefings.',
        icon: Info,
        color: 'text-gray-700'
    };

    const Icon = config.icon;

    return (
        <header className="bg-white border-b border-stone-200 py-8 text-center">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-center mb-3">
                    <Icon className={`w-8 h-8 ${config.color}`} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mb-2 font-heading">
                    {config.title}
                </h1>
                <p className="text-base text-stone-600 italic">
                    {config.description}
                </p>
            </div>
        </header>
    );
}
