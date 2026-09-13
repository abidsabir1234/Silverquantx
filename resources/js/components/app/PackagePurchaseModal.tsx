import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { packageService } from '@/services/packageService';
import type { PackagePlan } from '@/data/packages';
import type { CurrentPackage } from '@/data/currentPackage';

export interface PackagePurchaseModalProps {
    plan: PackagePlan | null;
    onClose: () => void;
    onActivated: (pkg: CurrentPackage) => void;
}

export function PackagePurchaseModal({ plan, onClose, onActivated }: PackagePurchaseModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activated, setActivated] = useState<CurrentPackage | null>(null);

    function handleClose() {
        setError(null);
        setActivated(null);
        onClose();
    }

    async function handleActivate() {
        if (!plan) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const pkg = await packageService.activatePackage(plan.id);
            setActivated(pkg);
            onActivated(pkg);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!plan) return null;

    if (activated) {
        return (
            <Modal isOpen onClose={handleClose} title="Package activated">
                <div className="flex flex-col items-center py-4 text-center">
                    <CheckCircle2 className="size-10 text-success" />
                    <p className="mt-3 font-medium text-text">Package activated successfully.</p>
                    <p className="mt-1 text-sm text-text-muted">Your {activated.name} is now active.</p>
                    <Button className="mt-6" onClick={handleClose}>
                        Done
                    </Button>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            isOpen
            onClose={handleClose}
            title={`Activate ${plan.name} Package`}
            footer={
                <>
                    <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleActivate} isLoading={isSubmitting}>
                        Activate Package
                    </Button>
                </>
            }
        >
            <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <dt className="text-text-muted">Package Amount</dt>
                    <dd className="font-medium text-text">${plan.amount.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-text-muted">Duration</dt>
                    <dd className="font-medium text-text">{plan.duration} days</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-text-muted">Hourly Rate</dt>
                    <dd className="font-medium text-text">{plan.hourlyRate}</dd>
                </div>
                <div className="flex justify-between border-t border-border-subtle pt-3">
                    <dt className="font-medium text-text">Total</dt>
                    <dd className="font-semibold text-text">${plan.amount.toLocaleString()}</dd>
                </div>
            </dl>

            <p className="mt-4 text-xs text-text-subtle">
                By activating, you agree that earnings depend on your package's configured rate and platform terms,
                and are not guaranteed.
            </p>

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
        </Modal>
    );
}
