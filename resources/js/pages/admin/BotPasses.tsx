import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { LoadingState } from '@/components/ui/LoadingState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { BotPassFormModal } from '@/components/admin/BotPassFormModal';
import { botService } from '@/services/botService';
import type { BotPassPlan } from '@/data/botPassPlansSeed';

export default function BotPasses() {
    const [plans, setPlans] = useState<BotPassPlan[] | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<BotPassPlan | null>(null);
    const [deactivateTarget, setDeactivateTarget] = useState<BotPassPlan | null>(null);

    function refresh() {
        botService.getBotPassPlans().then(setPlans);
    }

    useEffect(refresh, []);

    function openCreate() {
        setEditingPlan(null);
        setIsFormOpen(true);
    }

    function openEdit(plan: BotPassPlan) {
        setEditingPlan(plan);
        setIsFormOpen(true);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button leftIcon={<Plus className="size-4" />} onClick={openCreate}>
                    Create Bot Pass
                </Button>
            </div>

            <Card padding="none">
                {!plans ? (
                    <LoadingState />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Name</TableHeadCell>
                                <TableHeadCell>Price</TableHeadCell>
                                <TableHeadCell>Duration</TableHeadCell>
                                <TableHeadCell>Cycle Duration</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plans.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell>${plan.price.toLocaleString()}</TableCell>
                                    <TableCell className="text-text-muted">{plan.durationDays} days</TableCell>
                                    <TableCell className="text-text-muted">{plan.cycleDurationMinutes} min</TableCell>
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
                                                          onClick: () => botService.setBotPassPlanStatus(plan.id, 'active').then(refresh),
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

            <BotPassFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSaved={refresh} editingPlan={editingPlan} />

            <ConfirmModal
                isOpen={deactivateTarget !== null}
                onClose={() => setDeactivateTarget(null)}
                onConfirm={async () => {
                    if (!deactivateTarget) return;
                    await botService.setBotPassPlanStatus(deactivateTarget.id, 'inactive');
                    refresh();
                    setDeactivateTarget(null);
                }}
                title="Deactivate Bot Pass"
                description={deactivateTarget ? `${deactivateTarget.name} will no longer be available for new activations.` : undefined}
                confirmLabel="Deactivate"
                confirmVariant="danger"
            />
        </div>
    );
}
