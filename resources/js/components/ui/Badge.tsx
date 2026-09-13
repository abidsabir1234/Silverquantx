import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import type { Status } from '@/types/common';

export type BadgeVariant = Status | 'neutral' | 'info';

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
    active: 'bg-success/10 text-success ring-1 ring-inset ring-success/25',
    completed: 'bg-success/10 text-success ring-1 ring-inset ring-success/25',
    pending: 'bg-warning/10 text-warning ring-1 ring-inset ring-warning/25',
    processing: 'bg-accent/10 text-accent ring-1 ring-inset ring-accent/25',
    rejected: 'bg-danger/10 text-danger ring-1 ring-inset ring-danger/25',
    suspended: 'bg-danger/10 text-danger ring-1 ring-inset ring-danger/25',
    expired: 'bg-text-subtle/10 text-text-subtle ring-1 ring-inset ring-text-subtle/25',
    inactive: 'bg-text-subtle/10 text-text-subtle ring-1 ring-inset ring-text-subtle/25',
    neutral: 'bg-surface-alt text-text-muted ring-1 ring-inset ring-border',
    info: 'bg-accent/10 text-accent ring-1 ring-inset ring-accent/25',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

export function Badge({ className, variant = 'neutral', children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                VARIANT_CLASSES[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
