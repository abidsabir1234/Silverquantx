import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center">
            <span className="text-text-subtle">{icon ?? <Inbox className="size-8" />}</span>
            <p className="font-medium text-text">{title}</p>
            {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
        </div>
    );
}
