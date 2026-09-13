import { useEffect, useState } from 'react';
import { Users, Package, Gift, Share2 } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { statsService } from '@/services/statsService';
import type { PlatformStat } from '@/data/platformStats';

const ICONS: Record<string, typeof Users> = {
    'active-users': Users,
    'active-packages': Package,
    'total-rewards': Gift,
    'referral-members': Share2,
};

export function StatsSection() {
    const [stats, setStats] = useState<PlatformStat[] | null>(null);

    useEffect(() => {
        let cancelled = false;
        statsService.getPlatformStats().then((data) => {
            if (!cancelled) setStats(data);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {(stats ?? Array.from({ length: 4 })).map((stat, index) => {
                    if (!stat) {
                        return (
                            <div
                                key={index}
                                className="h-28 animate-pulse rounded-card border border-border-subtle bg-surface"
                            />
                        );
                    }
                    const Icon = ICONS[stat.id] ?? Users;
                    return (
                        <StatCard
                            key={stat.id}
                            label={stat.label}
                            value={stat.value}
                            icon={<Icon className="size-[18px]" />}
                            iconVariant="glow"
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 60}ms` }}
                        />
                    );
                })}
            </div>
        </section>
    );
}
