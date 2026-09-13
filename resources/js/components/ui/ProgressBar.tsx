import { cn } from '@/utils/cn';

export interface ProgressBarProps {
    value: number; // 0-100
    className?: string;
    trackClassName?: string;
}

export function ProgressBar({ value, className, trackClassName }: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, value));

    return (
        <div
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn('h-2 w-full overflow-hidden rounded-full bg-border-subtle', trackClassName)}
        >
            <div
                className={cn('h-full rounded-full bg-accent transition-all duration-500 ease-out', className)}
                style={{ width: `${clamped}%` }}
            />
        </div>
    );
}
