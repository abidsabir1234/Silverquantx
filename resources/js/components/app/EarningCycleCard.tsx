import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Play, Sparkles, PackageX } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button, buttonVariants } from '@/components/ui/Button';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { earningService } from '@/services/earningService';
import { packageService } from '@/services/packageService';
import type { EarningCycle } from '@/data/cycleSeed';
import type { CurrentPackage } from '@/data/currentPackage';

function daysRemaining(expiresAt: string): string {
    const ms = new Date(expiresAt).getTime() - Date.now();
    const days = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    return `${days} Day${days === 1 ? '' : 's'}`;
}

export function EarningCycleCard() {
    const [cycle, setCycle] = useState<EarningCycle | null>(null);
    const [pkg, setPkg] = useState<CurrentPackage | null | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [claimedAmount, setClaimedAmount] = useState<number | null>(null);

    const refreshCycle = useCallback(() => {
        earningService.getCurrentCycle().then(setCycle);
    }, []);

    useEffect(() => {
        refreshCycle();
        packageService.getCurrentPackage().then(setPkg);
    }, [refreshCycle]);

    // Re-sync with the (mock) server every second while running, so a locally-expired
    // countdown flips to "claim available" the moment the anchor timestamp passes.
    useEffect(() => {
        if (cycle?.status !== 'running') return;
        const interval = setInterval(refreshCycle, 1000);
        return () => clearInterval(interval);
    }, [cycle?.status, refreshCycle]);

    async function handleStart() {
        setError(null);
        setIsActionLoading(true);
        try {
            setClaimedAmount(null);
            const updated = await earningService.startCycle();
            setCycle(updated);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsActionLoading(false);
        }
    }

    async function handleClaim() {
        setError(null);
        try {
            const { cycle: updated, amountClaimed } = await earningService.claimCycle();
            setCycle(updated);
            setClaimedAmount(amountClaimed);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsConfirmOpen(false);
        }
    }

    if (!cycle || pkg === undefined) {
        return <Card padding="lg" className="h-64 animate-pulse" />;
    }

    if (pkg === null) {
        return (
            <Card padding="lg" className="flex flex-col items-center gap-3 py-12 text-center">
                <PackageX className="size-8 text-text-subtle" />
                <p className="font-medium text-text">You don't have an active package yet.</p>
                <p className="max-w-sm text-sm text-text-muted">
                    Activate a package to start an earning cycle and begin claiming payouts.
                </p>
                <Link to="/app/my-package" className={buttonVariants({ className: 'mt-2' })}>
                    Browse Packages
                </Link>
            </Card>
        );
    }

    return (
        <Card padding="lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-text-subtle">Active Package</p>
                    <h3 className="text-lg font-semibold text-text">{pkg.name}</h3>
                </div>
                <Badge variant={pkg.status}>{pkg.status}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                <div>
                    <p className="text-text-subtle">Hourly Rate</p>
                    <p className="font-medium text-text">{pkg.hourlyRate}</p>
                </div>
                <div>
                    <p className="text-text-subtle">Remaining Days</p>
                    <p className="font-medium text-text">{daysRemaining(pkg.expiresAt)}</p>
                </div>
                <div>
                    <p className="text-text-subtle">Cycle Status</p>
                    <p className="font-medium capitalize text-text">{cycle.status.replace('_', ' ')}</p>
                </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-4 rounded-control border border-border-subtle bg-surface-alt py-8">
                {cycle.status === 'ready' && (
                    <>
                        <p className="text-sm text-text-muted">Ready to start your next earning cycle.</p>
                        <Button size="lg" leftIcon={<Play className="size-4" />} isLoading={isActionLoading} onClick={handleStart}>
                            Start
                        </Button>
                    </>
                )}

                {cycle.status === 'running' && (
                    <>
                        <p className="text-sm text-text-muted">Running</p>
                        <CountdownTimer targetIso={cycle.endsAt} />
                    </>
                )}

                {cycle.status === 'claim_available' && (
                    <>
                        <p className="text-sm text-success">Claim Available</p>
                        <Button size="lg" leftIcon={<Sparkles className="size-4" />} onClick={() => setIsConfirmOpen(true)}>
                            Claim
                        </Button>
                    </>
                )}

                {cycle.status === 'claimed' && (
                    <>
                        <div className="flex items-center gap-2 text-success">
                            <CheckCircle2 className="size-5" />
                            <span className="text-sm font-medium">
                                Claimed{claimedAmount !== null ? ` — $${claimedAmount.toFixed(2)}` : ''}
                            </span>
                        </div>
                        <Button size="lg" leftIcon={<Play className="size-4" />} isLoading={isActionLoading} onClick={handleStart}>
                            Start Again
                        </Button>
                    </>
                )}
            </div>

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleClaim}
                title="Claim earnings?"
                description="This will add your earned amount to your wallet balance."
                confirmLabel="Claim"
            />
        </Card>
    );
}
