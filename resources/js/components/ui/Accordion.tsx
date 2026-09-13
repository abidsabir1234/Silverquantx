import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface AccordionItemData {
    id: string;
    question: string;
    answer: string;
}

export function Accordion({ items }: { items: AccordionItemData[] }) {
    const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

    return (
        <div className="divide-y divide-border-subtle overflow-hidden rounded-card border border-border-subtle bg-surface">
            {items.map((item, index) => {
                const isOpen = openId === item.id;
                return (
                    <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 40}ms` }}>
                        <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : item.id)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                            <span className="text-sm font-medium text-text">{item.question}</span>
                            <ChevronDown
                                className={cn(
                                    'size-4 shrink-0 text-text-subtle transition-transform duration-200',
                                    isOpen && 'rotate-180'
                                )}
                            />
                        </button>
                        {isOpen && (
                            <div className="px-5 pb-4 text-sm leading-relaxed text-text-muted">{item.answer}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
