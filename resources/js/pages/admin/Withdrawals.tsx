import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApproveRejectModal } from '@/components/admin/ApproveRejectModal';
import { withdrawService } from '@/services/withdrawService';
import { resolveUser } from '@/utils/resolveUser';
import type { Transaction } from '@/data/transactions';

const BADGE_VARIANT: Record<Transaction['status'], 'completed' | 'pending' | 'processing' | 'rejected'> = {
    completed: 'completed',
    pending: 'pending',
    processing: 'processing',
    rejected: 'rejected',
};

type ActionType = 'approve' | 'reject' | 'process';

export default function Withdrawals() {
    const [withdrawals, setWithdrawals] = useState<Transaction[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [action, setAction] = useState<{ type: ActionType; txn: Transaction } | null>(null);

    function refresh() {
        setError(null);
        withdrawService.listWithdrawals().then(setWithdrawals).catch((e: Error) => setError(e.message));
    }

    useEffect(refresh, []);

    const ACTION_COPY: Record<ActionType, { title: string; description: string; confirmLabel: string }> = {
        approve: {
            title: 'Approve Withdrawal',
            description: 'This withdrawal moves to processing. Funds stay reserved until it is marked processed.',
            confirmLabel: 'Approve',
        },
        process: {
            title: 'Process Withdrawal',
            description: 'This confirms funds have been sent to the user and finalizes the reserved balance.',
            confirmLabel: 'Mark Processed',
        },
        reject: {
            title: 'Reject Withdrawal',
            description: 'The reserved amount will be refunded to the user’s available balance.',
            confirmLabel: 'Reject Withdrawal',
        },
    };

    return (
        <div className="space-y-4">
            <Card padding="none">
                {error ? (
                    <ErrorState message={error} onRetry={refresh} />
                ) : !withdrawals ? (
                    <LoadingState />
                ) : withdrawals.length === 0 ? (
                    <EmptyState title="No withdrawals found" />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>User</TableHeadCell>
                                <TableHeadCell>Amount</TableHeadCell>
                                <TableHeadCell>Method</TableHeadCell>
                                <TableHeadCell>Reference</TableHeadCell>
                                <TableHeadCell>Requested</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {withdrawals.map((txn) => {
                                const user = resolveUser(txn.userId);
                                return (
                                    <TableRow key={txn.id}>
                                        <TableCell>
                                            <div className="font-medium text-text">{user.name}</div>
                                            <div className="text-xs text-text-subtle">{user.email}</div>
                                        </TableCell>
                                        <TableCell className="font-medium">${Math.abs(txn.amount).toFixed(2)}</TableCell>
                                        <TableCell className="text-text-muted">{txn.description.replace('Withdrawal to ', '')}</TableCell>
                                        <TableCell className="text-text-muted">{txn.reference}</TableCell>
                                        <TableCell className="text-text-muted">
                                            {new Date(txn.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={BADGE_VARIANT[txn.status]}>{txn.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Dropdown
                                                items={[
                                                    ...(txn.status === 'pending'
                                                        ? [
                                                              { label: 'Approve', onClick: () => setAction({ type: 'approve', txn }) },
                                                              {
                                                                  label: 'Reject',
                                                                  destructive: true,
                                                                  onClick: () => setAction({ type: 'reject', txn }),
                                                              },
                                                          ]
                                                        : []),
                                                    ...(txn.status === 'processing'
                                                        ? [{ label: 'Mark Processed', onClick: () => setAction({ type: 'process', txn }) }]
                                                        : []),
                                                ]}
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </Card>

            <ApproveRejectModal
                isOpen={action !== null}
                onClose={() => setAction(null)}
                transaction={action?.txn ?? null}
                title={action ? ACTION_COPY[action.type].title : ''}
                description={action ? ACTION_COPY[action.type].description : undefined}
                confirmLabel={action ? ACTION_COPY[action.type].confirmLabel : 'Confirm'}
                confirmVariant={action?.type === 'reject' ? 'danger' : 'primary'}
                onConfirm={async (txn) => {
                    if (action?.type === 'reject') {
                        await withdrawService.rejectWithdrawal(txn.id);
                    } else if (action?.type === 'process') {
                        await withdrawService.processWithdrawal(txn.id);
                    } else {
                        await withdrawService.approveWithdrawal(txn.id);
                    }
                    refresh();
                }}
            />
        </div>
    );
}
