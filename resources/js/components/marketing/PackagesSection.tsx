import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PackageCard } from '@/components/ui/PackageCard';
import { buttonVariants } from '@/components/ui/Button';
import { packageService } from '@/services/packageService';
import type { PackagePlan } from '@/data/packages';

export function PackagesSection({ limit, showViewAll = false }: { limit?: number; showViewAll?: boolean }) {
    const [plans, setPlans] = useState<PackagePlan[] | null>(null);

    useEffect(() => {
        let cancelled = false;
        packageService.getPackages().then((data) => {
            if (!cancelled) setPlans(data);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const visiblePlans = limit ? plans?.slice(0, limit) : plans;

    return (
        <section id="packages" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-text">Choose Your Package</h2>
                <p className="mt-3 text-text-muted">
                    Pick the amount, duration and hourly rate that fits your goals — every package activates
                    instantly once funded.
                </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {(visiblePlans ?? Array.from({ length: limit ?? 4 })).map((plan, index) =>
                    plan ? (
                        <div key={plan.id} className="animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
                            <PackageCard plan={plan} />
                        </div>
                    ) : (
                        <div key={index} className="h-80 animate-pulse rounded-card border border-border-subtle bg-surface" />
                    )
                )}
            </div>

            {showViewAll && (
                <div className="mt-10 flex justify-center">
                    <Link to="/packages" className={buttonVariants({ variant: 'outline' })}>
                        View All Packages
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            )}
        </section>
    );
}
