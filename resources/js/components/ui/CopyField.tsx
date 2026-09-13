import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CopyField({ value, label }: { value: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard API unavailable — no-op, field remains selectable for manual copy.
        }
    }

    return (
        <div>
            {label && <p className="mb-1.5 text-sm font-medium text-text">{label}</p>}
            <div className="flex items-center gap-2 rounded-control border border-border bg-surface-alt px-3.5 py-2.5">
                <span className="flex-1 truncate text-sm text-text">{value}</span>
                <Button variant="ghost" size="sm" onClick={handleCopy} leftIcon={copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}>
                    {copied ? 'Copied' : 'Copy'}
                </Button>
            </div>
        </div>
    );
}
