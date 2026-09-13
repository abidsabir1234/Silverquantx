import { useEffect, useState } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { referralService } from '@/services/referralService';
import type { BonusHoursSummary, ReferralEntry } from '@/data/referralSeed';

export default function BonusHours() {
    const [summary, setSummary] = useState<BonusHoursSummary | null>(null);
    const [referrals, setReferrals] = useState<ReferralEntry[] | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function refresh() {
        referralService.getBonusHoursSummary().then(setSummary);
        referralService.getReferralList().then(setReferrals);
    }

    useEffect(refresh, []);

    async function handleClaim() {
        setError(null);
        try {
            await referralService.claimBonusHours();
            refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
    }

    const claimable = referrals?.filter((r) => r.bonusStatus === 'pending') ?? [];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Available Bonus Hours" value={summary ? summary.available.toFixed(1) : '—'} />
                <StatCard label="Used Bonus Hours" value={summary ? summary.used.toFixed(1) : '—'} />
                <StatCard label="Total Earned Bonus Hours" value={summary ? summary.totalEarned.toFixed(1) : '—'} />
            </div>

            <Card padding="none">
                <div className="flex items-center justify-between p-5">
                    <CardHeader className="mb-0">
                        <CardTitle>Referral Bonus Hours</CardTitle>
                    </CardHeader>
                    <Button disabled={claimable.length === 0} onClick={() => setIsConfirmOpen(true)}>
                        Claim Bonus Hours
                    </Button>
                </div>

                {!referrals ? (
                    <LoadingState />
                ) : referrals.length === 0 ? (
                    <EmptyState title="No bonus hours yet" description="Bonus hours from your referrals will appear here." />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Referral</TableHeadCell>
                                <TableHeadCell>Bonus Hours</TableHeadCell>
                                <TableHeadCell>Date</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {referrals.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.userName}</TableCell>
                                    <TableCell>{entry.bonusHours.toFixed(1)}</TableCell>
                                    <TableCell className="text-text-muted">
                                        {new Date(entry.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={entry.bonusStatus === 'claimed' ? 'completed' : 'pending'}>{entry.bonusStatus}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {error && <p className="px-5 pb-4 text-sm text-danger">{error}</p>}
            </Card>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleClaim}
                title="Claim bonus hours?"
                description={`This will move ${claimable.reduce((sum, r) => sum + r.bonusHours, 0).toFixed(1)} pending hours to your available balance.`}
                confirmLabel="Claim"
            />
        </div>
    );
}
