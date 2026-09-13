import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { ButtonVariant } from '@/components/ui/Button';
import type { Transaction } from '@/data/transactions';

export interface ApproveRejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    title: string;
    description?: string;
    confirmLabel: string;
    confirmVariant?: ButtonVariant;
    onConfirm: (transaction: Transaction) => Promise<void> | void;
}

export function ApproveRejectModal({
    isOpen,
    onClose,
    transaction,
    title,
    description,
    confirmLabel,
    confirmVariant = 'primary',
    onConfirm,
}: ApproveRejectModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleConfirm() {
        if (!transaction) return;
        setIsSubmitting(true);
        try {
            await onConfirm(transaction);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant={confirmVariant} onClick={handleConfirm} isLoading={isSubmitting}>
                        {confirmLabel}
                    </Button>
                </>
            }
        >
            {transaction && (
                <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-text-subtle">Amount</dt>
                        <dd className="mt-1 font-medium text-text">${Math.abs(transaction.amount).toFixed(2)}</dd>
                    </div>
                    <div>
                        <dt className="text-text-subtle">Reference</dt>
                        <dd className="mt-1 font-medium text-text">{transaction.reference}</dd>
                    </div>
                    <div className="col-span-2">
                        <dt className="text-text-subtle">Description</dt>
                        <dd className="mt-1 font-medium text-text">{transaction.description}</dd>
                    </div>
                    <div>
                        <dt className="text-text-subtle">Submitted</dt>
                        <dd className="mt-1 font-medium text-text">
                            {new Date(transaction.date).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                            })}
                        </dd>
                    </div>
                </dl>
            )}
        </Modal>
    );
}
