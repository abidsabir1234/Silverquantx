import { useEffect, useMemo, useState } from 'react';
import { Wallet, TrendingUp, Hash } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { transactionService } from '@/services/transactionService';
import { resolveUser } from '@/utils/resolveUser';
import type { Transaction } from '@/data/transactions';

export default function Earnings() {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);

    useEffect(() => {
        transactionService.listAll().then(setTransactions);
    }, []);

    const earnings = useMemo(() => (transactions ?? []).filter((t) => t.type === 'earning'), [transactions]);

    const stats = useMemo(() => {
        const totalPaid = earnings.reduce((sum, t) => sum + t.amount, 0);
        const average = earnings.length ? totalPaid / earnings.length : 0;
        return { totalPaid, count: earnings.length, average };
    }, [earnings]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Earnings Paid" value={`$${stats.totalPaid.toFixed(2)}`} icon={<Wallet className="size-5" />} />
                <StatCard label="Payout Count" value={String(stats.count)} icon={<Hash className="size-5" />} />
                <StatCard label="Average Payout" value={`$${stats.average.toFixed(2)}`} icon={<TrendingUp className="size-5" />} />
            </div>

            <Card padding="none">
                {!transactions ? (
                    <LoadingState />
                ) : earnings.length === 0 ? (
                    <EmptyState title="No earning payouts found" />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>User</TableHeadCell>
                                <TableHeadCell>Date</TableHeadCell>
                                <TableHeadCell>Description</TableHeadCell>
                                <TableHeadCell>Amount</TableHeadCell>
                                <TableHeadCell>Reference</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {earnings.map((txn) => {
                                const user = resolveUser(txn.userId);
                                return (
                                    <TableRow key={txn.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell className="text-text-muted">
                                            {new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell className="text-text-muted">{txn.description}</TableCell>
                                        <TableCell className="font-medium text-success">+${txn.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-text-muted">{txn.reference}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    );
}
