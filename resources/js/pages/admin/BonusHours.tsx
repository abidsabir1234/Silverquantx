import { useEffect, useState } from 'react';
import { Clock, Hourglass, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { referralService } from '@/services/referralService';
import type { ReferralEntry, BonusHoursSummary } from '@/data/referralSeed';

export default function BonusHours() {
    const [referrals, setReferrals] = useState<ReferralEntry[] | null>(null);
    const [summary, setSummary] = useState<BonusHoursSummary | null>(null);

    function refresh() {
        referralService.getAllReferrals().then(setReferrals);
        referralService.getAllBonusHoursSummary().then(setSummary);
    }

    useEffect(refresh, []);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Available Hours" value={(summary?.available ?? 0).toFixed(1)} icon={<Clock className="size-5" />} />
                <StatCard label="Pending Hours" value={(summary?.pending ?? 0).toFixed(1)} icon={<Hourglass className="size-5" />} />
                <StatCard label="Total Earned" value={(summary?.totalEarned ?? 0).toFixed(1)} icon={<CheckCircle2 className="size-5" />} />
            </div>

            <Card padding="none">
                {!referrals ? (
                    <LoadingState />
                ) : referrals.length === 0 ? (
                    <EmptyState title="No bonus hour grants found" />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Referred User</TableHeadCell>
                                <TableHeadCell>Joined</TableHeadCell>
                                <TableHeadCell>Bonus Hours</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {referrals.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell className="font-medium">{r.userName}</TableCell>
                                    <TableCell className="text-text-muted">
                                        {new Date(r.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell>{r.bonusHours.toFixed(1)}</TableCell>
                                    <TableCell>
                                        <Badge variant={r.bonusStatus === 'claimed' ? 'completed' : 'pending'}>{r.bonusStatus}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {r.bonusStatus === 'pending' && (
                                            <Dropdown
                                                items={[
                                                    {
                                                        label: 'Mark Claimed',
                                                        onClick: () => referralService.setBonusStatus(r.id, 'claimed').then(refresh),
                                                    },
                                                ]}
                                            />
                                        )}
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
