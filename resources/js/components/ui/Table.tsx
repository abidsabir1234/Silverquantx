import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export function Table({ children }: { children: ReactNode }) {
    return (
        <div className="overflow-x-auto rounded-card border border-border-subtle bg-surface">
            <table className="w-full min-w-max text-left text-sm">{children}</table>
        </div>
    );
}

export function TableHead({ children }: { children: ReactNode }) {
    return <thead className="border-b border-border-subtle bg-surface-alt/60">{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
    return <tbody className="divide-y divide-border-subtle">{children}</tbody>;
}

export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
    return <tr className={cn('transition-colors hover:bg-surface-alt/40', className)} {...props} />;
}

export function TableHeadCell({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn('whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-subtle', className)}
            {...props}
        />
    );
}

export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
    return <td className={cn('whitespace-nowrap px-4 py-3.5 text-text', className)} {...props} />;
}
