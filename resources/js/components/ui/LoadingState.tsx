import { Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-16 text-center text-text-muted">
            <Loader2 className="size-6 animate-spin" />
            <p className="text-sm">{label}</p>
        </div>
    );
}
