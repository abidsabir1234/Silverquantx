import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/utils/cn';
import { transactionService } from '@/services/transactionService';
import { resolveUser } from '@/utils/resolveUser';
import type { Transaction, TransactionType } from '@/data/transactions';

const FILTERS: { value: TransactionType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'earning', label: 'Earning' },
    { value: 'referral', label: 'Referral' },
    { value: 'bonus', label: 'Bonus' },
    { value: 'package', label: 'Package' },
];

const BADGE_VARIANT: Record<Transaction['status'], 'completed' | 'pending' | 'processing' | 'rejected'> = {
    completed: 'completed',
    pending: 'pending',
    processing: 'processing',
    rejected: 'rejected',
};

const PAGE_SIZE = 10;

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [filter, setFilter] = useState<TransactionType | 'all'>('all');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        transactionService.listAll().then(setTransactions);
    }, []);

    const filtered = useMemo(() => {
        if (!transactions) return [];
        return transactions.filter((t) => {
            if (filter !== 'all' && t.type !== filter) return false;
            if (search && !`${t.description} ${t.reference}`.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [transactions, filter, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => {
                            setFilter(f.value);
                            setPage(1);
                        }}
                        className={cn(
                            'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                            filter === f.value ? 'bg-silver text-[#080B0A]' : 'bg-surface text-text-muted hover:text-text'
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <Input
                leftIcon={<Search className="size-4" />}
                placeholder="Search description or reference"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                className="max-w-xs"
            />

            <Card padding="none">
                {!transactions ? (
                    <LoadingState />
                ) : filtered.length === 0 ? (
                    <EmptyState title="No transactions found" />
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeadCell>User</TableHeadCell>
                                    <TableHeadCell>Date</TableHeadCell>
                                    <TableHeadCell>Type</TableHeadCell>
                                    <TableHeadCell>Description</TableHeadCell>
                                    <TableHeadCell>Amount</TableHeadCell>
                                    <TableHeadCell>Balance</TableHeadCell>
                                    <TableHeadCell>Status</TableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pageItems.map((txn) => {
                                    const user = resolveUser(txn.userId);
                                    return (
                                        <TableRow key={txn.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell className="text-text-muted">
                                                {new Date(txn.date).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell className="capitalize">{txn.type}</TableCell>
                                            <TableCell className="text-text-muted">{txn.description}</TableCell>
                                            <TableCell className={cn('font-medium', txn.amount < 0 ? 'text-danger' : 'text-success')}>
                                                {txn.amount < 0 ? '-' : '+'}${Math.abs(txn.amount).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-text-muted">${txn.balanceAfter.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant={BADGE_VARIANT[txn.status]}>{txn.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </>
                )}
            </Card>
        </div>
    );
}
