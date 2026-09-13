import type { CSSProperties, ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

export interface StatCardProps {
    label: string;
    value: string;
    icon?: ReactNode;
    trend?: { direction: 'up' | 'down'; label: string };
    className?: string;
    style?: CSSProperties;
    /** 'glow' renders the icon in a tinted, glowing badge instead of a plain icon — used on the marketing pages. */
    iconVariant?: 'flat' | 'glow';
}

export function StatCard({ label, value, icon, trend, className, style, iconVariant = 'flat' }: StatCardProps) {
    return (
        <Card style={style} className={cn('flex flex-col gap-3', className)}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-muted">{label}</span>
                {icon &&
                    (iconVariant === 'glow' ? (
                        <span className="flex size-11 items-center justify-center rounded-xl border border-accent/30 bg-gradient-to-br from-accent/25 to-accent/5 text-silver-light shadow-[0_10px_22px_-12px_rgba(124,140,248,0.65)]">
                            {icon}
                        </span>
                    ) : (
                        <span className="text-silver">{icon}</span>
                    ))}
            </div>
            <div className="flex items-end justify-between gap-2">
                <span className="text-2xl font-bold tracking-tight text-text">{value}</span>
                {trend && (
                    <span
                        className={cn(
                            'flex items-center gap-1 text-xs font-medium',
                            trend.direction === 'up' ? 'text-success' : 'text-danger'
                        )}
                    >
                        {trend.direction === 'up' ? (
                            <TrendingUp className="size-3.5" />
                        ) : (
                            <TrendingDown className="size-3.5" />
                        )}
                        {trend.label}
                    </span>
                )}
            </div>
        </Card>
    );
}
