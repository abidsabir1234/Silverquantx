import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/utils/cn';
import type { Transaction } from '@/data/transactions';

const BADGE_VARIANT: Record<Transaction['status'], 'completed' | 'pending' | 'processing' | 'rejected'> = {
    completed: 'completed',
    pending: 'pending',
    processing: 'processing',
    rejected: 'rejected',
};

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
    if (transactions.length === 0) {
        return <EmptyState title="No transactions found." description="Your transaction history will appear here." />;
    }

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeadCell>Date</TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Description</TableHeadCell>
                    <TableHeadCell>Amount</TableHeadCell>
                    <TableHeadCell>Balance</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {transactions.map((txn) => (
                    <TableRow key={txn.id}>
                        <TableCell className="text-text-muted">
                            {new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
                ))}
            </TableBody>
        </Table>
    );
}
