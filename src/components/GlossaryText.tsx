import { GlossaryTerm } from './GlossaryTerm';
import glossaryData from '@/lib/glossary.json';

interface GlossaryTextProps {
    text: string;
}

export function GlossaryText({ text }: GlossaryTextProps) {
    if (!text) return null;

    // Create a regex pattern from all glossary terms
    // Escape special characters just in case, though our current terms are simple
    const terms = glossaryData.map(g => g.term).sort((a, b) => b.length - a.length); // Match longest terms first
    if (terms.length === 0) return <>{text}</>;

    const pattern = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');

    const parts = text.split(pattern);

    return (
        <>
            {parts.map((part, index) => {
                const lowerPart = part.toLowerCase();
                const glossaryEntry = glossaryData.find(g => g.term.toLowerCase() === lowerPart);

                if (glossaryEntry) {
                    return (
                        <GlossaryTerm
                            key={`${index}-${part}`}
                            term={part} // Keep original casing from text
                            definition={glossaryEntry.definition}
                        />
                    );
                }

                return <span key={index}>{part}</span>;
            })}
        </>
    );
}
