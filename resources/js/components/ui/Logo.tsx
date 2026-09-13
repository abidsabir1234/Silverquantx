import { cn } from '@/utils/cn';

export type LogoSize = 'sm' | 'md' | 'lg';

const ICON_SIZE: Record<LogoSize, string> = {
    sm: 'size-7',
    md: 'size-9',
    lg: 'size-12',
};

const TEXT_SIZE: Record<LogoSize, string> = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-[28px]',
};

export interface LogoProps {
    size?: LogoSize;
    showText?: boolean;
    /** Shows the small uppercase tagline under the wordmark — only meant for the larger auth-screen lockup. */
    showTagline?: boolean;
    className?: string;
}

/**
 * The SilverQuantX mark: a heavy, solid emblem — a dense dark badge carrying a
 * thick two-tone signal line (silver folding into accent green) that reads as
 * an "S" and a rising/falling trend line at once. Flat fills, no gradients or
 * rings, but full-weight strokes and a solid badge so it carries real presence.
 */
export function Logo({ size = 'md', showText = true, showTagline = false, className }: LogoProps) {
    return (
        <span className={cn('inline-flex items-center gap-2.5', className)}>
            <svg
                viewBox="0 0 48 48"
                className={cn('shrink-0', ICON_SIZE[size])}
                aria-hidden={showText}
                role={showText ? undefined : 'img'}
            >
                {showText ? null : <title>SilverQuantX</title>}
                <rect x="1" y="1" width="46" height="46" rx="12" fill="#0d110f" stroke="#2a3530" strokeWidth="1.5" />
                <path d="M13 15 L33 15 L23 24" fill="none" stroke="#f3f4f6" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23 24 L13 33 L33 33" fill="none" stroke="#00C985" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {showText && (
                <span className="flex flex-col justify-center">
                    <span className={cn('font-extrabold leading-none tracking-tight text-text', TEXT_SIZE[size])}>
                        SilverQuant<span className="text-accent">X</span>
                    </span>
                    {showTagline && (
                        <span className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-text-subtle">
                            Algorithmic Wealth Platform
                        </span>
                    )}
                </span>
            )}
        </span>
    );
}
