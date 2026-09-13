import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    padding?: 'none' | 'sm' | 'md' | 'lg';
    interactive?: boolean;
    /** Frosted-glass treatment for cards floating over decorative backgrounds (e.g. the marketing hero). */
    glass?: boolean;
}

const PADDING_CLASSES: Record<NonNullable<CardProps['padding']>, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export function Card({ className, padding = 'md', interactive = false, glass = false, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-card border shadow-card',
                glass ? 'border-white/10 bg-surface/70 shadow-elevated backdrop-blur-xl' : 'border-border-subtle bg-surface',
                interactive && 'transition-colors duration-150 hover:border-border',
                PADDING_CLASSES[padding],
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('mb-4 flex items-center justify-between gap-3', className)} {...props} />;
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn('text-base font-semibold text-text', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
    return <p className={cn('text-sm text-text-muted', className)} {...props} />;
}
