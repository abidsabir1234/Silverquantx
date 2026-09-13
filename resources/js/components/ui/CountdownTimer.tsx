import { useCountdown } from '@/hooks/useCountdown';
import { cn } from '@/utils/cn';

export function CountdownTimer({ targetIso, className }: { targetIso: string | null; className?: string }) {
    const { formatted } = useCountdown(targetIso);

    return <span className={cn('font-mono text-2xl font-bold tabular-nums text-text', className)}>{formatted}</span>;
}
