import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface TabDef {
    key: string;
    label: string;
    content: ReactNode;
}

export function Tabs({ tabs, defaultTab }: { tabs: TabDef[]; defaultTab?: string }) {
    const [active, setActive] = useState(defaultTab ?? tabs[0]?.key);
    const activeTab = tabs.find((t) => t.key === active);

    return (
        <div>
            <div className="flex gap-1 overflow-x-auto border-b border-border-subtle">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActive(tab.key)}
                        className={cn(
                            'shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                            active === tab.key
                                ? 'border-silver text-text'
                                : 'border-transparent text-text-muted hover:text-text'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="pt-5">{activeTab?.content}</div>
        </div>
    );
}
