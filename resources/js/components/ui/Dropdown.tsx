import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface DropdownItem {
    label: string;
    onClick: () => void;
    destructive?: boolean;
}

export function Dropdown({ items, trigger }: { items: DropdownItem[]; trigger?: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setIsOpen((v) => !v)}
                aria-label="Open actions"
                className="rounded-control p-1.5 text-text-subtle hover:bg-surface-alt hover:text-text"
            >
                {trigger ?? <MoreVertical className="size-4" />}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-30 mt-1 w-40 overflow-hidden rounded-control border border-border-subtle bg-surface shadow-elevated">
                    {items.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                setIsOpen(false);
                                item.onClick();
                            }}
                            className={cn(
                                'block w-full px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-surface-alt',
                                item.destructive ? 'text-danger' : 'text-text'
                            )}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
