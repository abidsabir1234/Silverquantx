import { useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { Modal } from '@/components/ui/Modal';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ApproveRejectModal } from '@/components/admin/ApproveRejectModal';
import { depositService } from '@/services/depositService';
import { resolveUser } from '@/utils/resolveUser';
import type { Transaction } from '@/data/transactions';

const BADGE_VARIANT: Record<Transaction['status'], 'completed' | 'pending' | 'processing' | 'rejected'> = {
    completed: 'completed',
    pending: 'pending',
    processing: 'processing',
    rejected: 'rejected',
};

export default function Deposits() {
    const [deposits, setDeposits] = useState<Transaction[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [action, setAction] = useState<{ type: 'approve' | 'reject'; txn: Transaction } | null>(null);
    const [proofTxn, setProofTxn] = useState<Transaction | null>(null);

    function refresh() {
        setError(null);
        depositService.listDeposits().then(setDeposits).catch((e: Error) => setError(e.message));
    }

    useEffect(refresh, []);

    return (
        <div className="space-y-4">
            <Card padding="none">
                {error ? (
                    <ErrorState message={error} onRetry={refresh} />
                ) : !deposits ? (
                    <LoadingState />
                ) : deposits.length === 0 ? (
                    <EmptyState title="No deposits found" />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>User</TableHeadCell>
                                <TableHeadCell>Amount</TableHeadCell>
                                <TableHeadCell>Method</TableHeadCell>
                                <TableHeadCell>Reference</TableHeadCell>
                                <TableHeadCell>Submitted</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deposits.map((txn) => {
                                const user = resolveUser(txn.userId);
                                return (
                                    <TableRow key={txn.id}>
                                        <TableCell>
                                            <div className="font-medium text-text">{user.name}</div>
                                            <div className="text-xs text-text-subtle">{user.email}</div>
                                        </TableCell>
                                        <TableCell className="font-medium">${txn.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-text-muted">{txn.description.replace('Deposit via ', '')}</TableCell>
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
                                                    { label: 'View Proof', onClick: () => setProofTxn(txn) },
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
                title={action?.type === 'reject' ? 'Reject Deposit' : 'Approve Deposit'}
                description={
                    action?.type === 'reject'
                        ? 'This deposit will be marked as rejected and no funds will be credited.'
                        : 'The deposit amount will be credited to the user’s available balance.'
                }
                confirmLabel={action?.type === 'reject' ? 'Reject Deposit' : 'Approve Deposit'}
                confirmVariant={action?.type === 'reject' ? 'danger' : 'primary'}
                onConfirm={async (txn) => {
                    if (action?.type === 'reject') {
                        await depositService.rejectDeposit(txn.id);
                    } else {
                        await depositService.approveDeposit(txn.id);
                    }
                    refresh();
                }}
            />

            <Modal isOpen={proofTxn !== null} onClose={() => setProofTxn(null)} title="Proof of Payment" size="sm">
                {proofTxn && (
                    <div className="flex flex-col items-center gap-3 rounded-control border border-dashed border-border py-10 text-center">
                        <FileText className="size-8 text-text-subtle" />
                        <p className="text-sm text-text-muted">
                            Payment proof for reference <span className="font-medium text-text">{proofTxn.reference}</span> would appear here.
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
}
