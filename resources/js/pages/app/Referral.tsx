import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { CopyField } from '@/components/ui/CopyField';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { ReferralChart } from '@/components/app/ReferralChart';
import { useAuth } from '@/hooks/useAuth';
import { referralService } from '@/services/referralService';
import type { ReferralEntry, ReferralActivityPoint } from '@/data/referralSeed';

export default function Referral() {
    const { user } = useAuth();
    const [stats, setStats] = useState<{ totalReferrals: number; activeReferrals: number; bonusHours: number; pendingBonusHours: number } | null>(null);
    const [referrals, setReferrals] = useState<ReferralEntry[] | null>(null);
    const [activity, setActivity] = useState<ReferralActivityPoint[] | null>(null);

    useEffect(() => {
        referralService.getReferralStats().then(setStats);
        referralService.getReferralList().then(setReferrals);
        referralService.getReferralActivity().then(setActivity);
    }, []);

    const referralLink = `${window.location.origin}/register?ref=${user?.referralCode ?? ''}`;

    return (
        <div className="space-y-6">
            <Card padding="lg">
                <div className="grid gap-4 sm:grid-cols-2">
                    <CopyField label="Referral Link" value={referralLink} />
                    <CopyField label="Referral Code" value={user?.referralCode ?? ''} />
                </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Referrals" value={stats ? String(stats.totalReferrals) : '—'} />
                <StatCard label="Active Referrals" value={stats ? String(stats.activeReferrals) : '—'} />
                <StatCard label="Bonus Hours" value={stats ? `${stats.bonusHours.toFixed(1)}` : '—'} />
                <StatCard label="Pending Bonus Hours" value={stats ? `${stats.pendingBonusHours.toFixed(1)}` : '—'} />
            </div>

            <Card padding="lg">
                <CardHeader>
                    <CardTitle>Referral Activity</CardTitle>
                </CardHeader>
                {activity ? <ReferralChart data={activity} /> : <LoadingState />}
            </Card>

            <Card padding="none">
                <div className="p-5">
                    <CardHeader className="mb-0">
                        <CardTitle>Your Referrals</CardTitle>
                    </CardHeader>
                </div>
                {!referrals ? (
                    <LoadingState />
                ) : referrals.length === 0 ? (
                    <EmptyState title="No referrals yet" description="Share your link to start earning bonus hours." />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>User</TableHeadCell>
                                <TableHeadCell>Joined Date</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell>Bonus Hours</TableHeadCell>
                                <TableHeadCell>Bonus Status</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {referrals.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.userName}</TableCell>
                                    <TableCell className="text-text-muted">
                                        {new Date(entry.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={entry.status === 'active' ? 'active' : 'inactive'}>{entry.status}</Badge>
                                    </TableCell>
                                    <TableCell>{entry.bonusHours.toFixed(1)}</TableCell>
                                    <TableCell>
                                        <Badge variant={entry.bonusStatus === 'claimed' ? 'completed' : 'pending'}>{entry.bonusStatus}</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    );
}
