import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { PackageFormModal } from '@/components/admin/PackageFormModal';
import { packageService } from '@/services/packageService';
import type { PackagePlan } from '@/data/packages';

export default function Packages() {
    const [plans, setPlans] = useState<PackagePlan[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<PackagePlan | null>(null);
    const [deactivateTarget, setDeactivateTarget] = useState<PackagePlan | null>(null);

    function refresh() {
        setError(null);
        packageService.getPackages().then(setPlans).catch((e: Error) => setError(e.message));
    }

    useEffect(refresh, []);

    function openCreate() {
        setEditingPlan(null);
        setIsFormOpen(true);
    }

    function openEdit(plan: PackagePlan) {
        setEditingPlan(plan);
        setIsFormOpen(true);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button leftIcon={<Plus className="size-4" />} onClick={openCreate}>
                    Create Package
                </Button>
            </div>

            <Card padding="none">
                {error ? (
                    <ErrorState message={error} onRetry={refresh} />
                ) : !plans ? (
                    <LoadingState />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Name</TableHeadCell>
                                <TableHeadCell>Amount</TableHeadCell>
                                <TableHeadCell>Duration</TableHeadCell>
                                <TableHeadCell>Hourly Rate</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plans.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell>${plan.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-text-muted">{plan.duration} days</TableCell>
                                    <TableCell className="text-text-muted">{plan.hourlyRate}</TableCell>
                                    <TableCell>
                                        <Badge variant={plan.status === 'active' ? 'active' : 'inactive'}>{plan.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Dropdown
                                            items={[
                                                { label: 'Edit', onClick: () => openEdit(plan) },
                                                plan.status === 'active'
                                                    ? {
                                                          label: 'Deactivate',
                                                          destructive: true,
                                                          onClick: () => setDeactivateTarget(plan),
                                                      }
                                                    : {
                                                          label: 'Activate',
                                                          onClick: () => packageService.setPackageStatus(plan.id, 'active').then(refresh),
                                                      },
                                            ]}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            <PackageFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSaved={refresh} editingPlan={editingPlan} />

            <ConfirmModal
                isOpen={deactivateTarget !== null}
                onClose={() => setDeactivateTarget(null)}
                onConfirm={async () => {
                    if (!deactivateTarget) return;
                    await packageService.setPackageStatus(deactivateTarget.id, 'inactive');
                    refresh();
                    setDeactivateTarget(null);
                }}
                title="Deactivate Package"
                description={deactivateTarget ? `${deactivateTarget.name} will no longer be available for new activations.` : undefined}
                confirmLabel="Deactivate"
                confirmVariant="danger"
            />
        </div>
    );
}
