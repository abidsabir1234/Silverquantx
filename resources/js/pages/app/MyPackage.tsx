import { useCallback, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PackageCard } from '@/components/ui/PackageCard';
import { PackagePurchaseModal } from '@/components/app/PackagePurchaseModal';
import { PackageExpiredState } from '@/components/app/PackageExpiredState';
import { packageService } from '@/services/packageService';
import { earningService } from '@/services/earningService';
import type { CurrentPackage } from '@/data/currentPackage';
import type { PackageHistoryEntry } from '@/data/packageHistorySeed';
import type { EarningCycle } from '@/data/cycleSeed';
import type { PackagePlan } from '@/data/packages';

function packageProgress(pkg: CurrentPackage): number {
    const total = new Date(pkg.expiresAt).getTime() - new Date(pkg.startedAt).getTime();
    const elapsed = Date.now() - new Date(pkg.startedAt).getTime();
    if (total <= 0) return 100;
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

export default function MyPackage() {
    const [pkg, setPkg] = useState<CurrentPackage | null>(null);
    const [history, setHistory] = useState<PackageHistoryEntry[]>([]);
    const [cycle, setCycle] = useState<EarningCycle | null>(null);
    const [plans, setPlans] = useState<PackagePlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<PackagePlan | null>(null);

    const refresh = useCallback(() => {
        packageService.getCurrentPackage().then(setPkg);
        packageService.getPackageHistory().then(setHistory);
        earningService.getCurrentCycle().then(setCycle);
    }, []);

    useEffect(() => {
        refresh();
        packageService.getPackages().then(setPlans);
    }, [refresh]);

    return (
        <div className="space-y-8">
            {pkg?.status === 'expired' ? (
                <PackageExpiredState pkg={pkg} cycle={cycle} />
            ) : pkg ? (
                <Card padding="lg">
                    <CardHeader>
                        <CardTitle>{pkg.name}</CardTitle>
                        <Badge variant="active">Active</Badge>
                    </CardHeader>

                    <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                        <div>
                            <dt className="text-text-subtle">Amount</dt>
                            <dd className="mt-1 font-medium text-text">${pkg.amount.toLocaleString()}</dd>
                        </div>
                        <div>
                            <dt className="text-text-subtle">Hourly Rate</dt>
                            <dd className="mt-1 font-medium text-text">{pkg.hourlyRate}</dd>
                        </div>
                        <div>
                            <dt className="text-text-subtle">Started</dt>
                            <dd className="mt-1 font-medium text-text">
                                {new Date(pkg.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-text-subtle">Expires</dt>
                            <dd className="mt-1 font-medium text-text">
                                {new Date(pkg.expiresAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-5">
                        <ProgressBar value={packageProgress(pkg)} />
                    </div>
                </Card>
            ) : (
                <Card padding="lg">
                    <p className="text-sm text-text-muted">You don't have an active package yet.</p>
                </Card>
            )}

            {history.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Package History</CardTitle>
                    </CardHeader>
                    <div className="space-y-3">
                        {history.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-center justify-between rounded-control border border-border-subtle bg-surface-alt px-4 py-3 text-sm"
                            >
                                <div>
                                    <p className="font-medium text-text">{entry.name}</p>
                                    <p className="text-text-subtle">
                                        {new Date(entry.startedAt).toLocaleDateString()} &ndash;{' '}
                                        {new Date(entry.endedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-text">${entry.amount.toLocaleString()}</span>
                                    <Badge variant={entry.status}>{entry.status}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <div id="browse-packages">
                <h2 className="mb-4 text-lg font-semibold text-text">Browse Packages</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <PackageCard key={plan.id} plan={plan} onSelect={setSelectedPlan} />
                    ))}
                </div>
            </div>

            <PackagePurchaseModal
                plan={selectedPlan}
                onClose={() => setSelectedPlan(null)}
                onActivated={() => {
                    refresh();
                }}
            />
        </div>
    );
}
