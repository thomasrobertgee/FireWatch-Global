"use client";

import * as React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface GlossaryTermProps {
    term: string;
    definition: string;
}

export function GlossaryTerm({ term, definition }: GlossaryTermProps) {
    return (
        <Tooltip.Provider>
            <Tooltip.Root delayDuration={200}>
                <Tooltip.Trigger asChild>
                    <span className="cursor-help border-b-2 border-dotted border-emerald-500 text-emerald-900 font-medium decoration-emerald-500/50 hover:bg-emerald-50 transition-colors">
                        {term}
                    </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="z-50 select-none rounded-md bg-stone-900 px-4 py-3 text-sm leading-relaxed text-white shadow-xl max-w-xs animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                        sideOffset={5}
                    >
                        <p className="font-semibold text-emerald-300 mb-1">{term}</p>
                        {definition}
                        <Tooltip.Arrow className="fill-stone-900" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
