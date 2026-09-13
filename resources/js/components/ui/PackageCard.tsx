import { Link } from 'react-router-dom';
import { Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import type { PackagePlan } from '@/data/packages';

export interface PackageCardProps {
    plan: PackagePlan;
    /** Authenticated context (e.g. My Package): renders an "Activate Package" button instead of linking to /register. */
    onSelect?: (plan: PackagePlan) => void;
}

export function PackageCard({ plan, onSelect }: PackageCardProps) {
    return (
        <Card
            padding="lg"
            className={cn(
                'relative flex flex-col overflow-hidden before:absolute before:inset-x-6 before:top-0 before:h-0.5 before:rounded-b-full before:bg-gradient-to-r before:from-transparent before:via-accent/60 before:to-transparent before:content-[""]',
                plan.featured &&
                    'border-accent/50 shadow-[0_0_0_1px_rgba(0,201,133,0.35)] shadow-elevated -translate-y-2 before:via-accent before:h-[3px]'
            )}
        >
            {plan.featured && (
                <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-silver-light to-silver px-2.5 py-1 text-xs font-semibold text-[#080B0A] shadow-[0_6px_16px_-6px_rgba(0,201,133,0.7)]">
                    Most Popular
                </span>
            )}

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text">{plan.name}</h3>
                <Badge variant={plan.status === 'active' ? 'active' : 'inactive'}>{plan.status}</Badge>
            </div>

            <p className="mt-4 text-[34px] font-extrabold leading-none tracking-tight text-text">
                ${plan.amount.toLocaleString()}
            </p>

            <div className="mt-4 space-y-2 text-sm text-text-muted">
                <div className="flex items-center gap-2">
                    <Clock className="size-4 text-text-subtle" />
                    {plan.duration} day cycle
                </div>
                <div className="flex items-center gap-2">
                    <Zap className="size-4 text-text-subtle" />
                    {plan.hourlyRate}
                </div>
            </div>

            {onSelect ? (
                <Button className="mt-6 w-full" onClick={() => onSelect(plan)}>
                    Activate Package
                </Button>
            ) : (
                <Link to="/register" className={cn(buttonVariants(), 'mt-6 w-full')}>
                    Get Started
                </Link>
            )}
        </Card>
    );
}
