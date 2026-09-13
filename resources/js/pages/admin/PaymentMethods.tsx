import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { settingsService } from '@/services/settingsService';
import type { PaymentMethodConfig } from '@/data/paymentMethodsSeed';

export default function PaymentMethods() {
    const [methods, setMethods] = useState<PaymentMethodConfig[] | null>(null);
    const [editingMethod, setEditingMethod] = useState<PaymentMethodConfig | null>(null);
    const [feePercent, setFeePercent] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [disableTarget, setDisableTarget] = useState<PaymentMethodConfig | null>(null);

    function refresh() {
        settingsService.getPaymentMethods().then(setMethods);
    }

    useEffect(refresh, []);

    function openEdit(method: PaymentMethodConfig) {
        setEditingMethod(method);
        setFeePercent(String(method.feePercent));
    }

    async function handleSaveFee() {
        if (!editingMethod) return;
        setIsSaving(true);
        try {
            await settingsService.updatePaymentMethod(editingMethod.id, { feePercent: Number(feePercent) });
            refresh();
            setEditingMethod(null);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-4">
            <Card padding="none">
                {!methods ? (
                    <LoadingState />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Method</TableHeadCell>
                                <TableHeadCell>Type</TableHeadCell>
                                <TableHeadCell>Fee</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {methods.map((method) => (
                                <TableRow key={method.id}>
                                    <TableCell className="font-medium">{method.name}</TableCell>
                                    <TableCell className="capitalize text-text-muted">{method.type}</TableCell>
                                    <TableCell className="text-text-muted">{method.feePercent}%</TableCell>
                                    <TableCell>
                                        <Badge variant={method.status === 'active' ? 'active' : 'inactive'}>{method.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Dropdown
                                            items={[
                                                { label: 'Edit Fee', onClick: () => openEdit(method) },
                                                method.status === 'active'
                                                    ? {
                                                          label: 'Disable',
                                                          destructive: true,
                                                          onClick: () => setDisableTarget(method),
                                                      }
                                                    : {
                                                          label: 'Enable',
                                                          onClick: () =>
                                                              settingsService.updatePaymentMethod(method.id, { status: 'active' }).then(refresh),
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

            <Modal
                isOpen={editingMethod !== null}
                onClose={() => setEditingMethod(null)}
                title={`Edit Fee — ${editingMethod?.name ?? ''}`}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setEditingMethod(null)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveFee} isLoading={isSaving}>
                            Save
                        </Button>
                    </>
                }
            >
                <Input
                    label="Fee Percent (%)"
                    type="number"
                    step="0.1"
                    value={feePercent}
                    onChange={(e) => setFeePercent(e.target.value)}
                />
            </Modal>

            <ConfirmModal
                isOpen={disableTarget !== null}
                onClose={() => setDisableTarget(null)}
                onConfirm={async () => {
                    if (!disableTarget) return;
                    await settingsService.updatePaymentMethod(disableTarget.id, { status: 'inactive' });
                    refresh();
                    setDisableTarget(null);
                }}
                title="Disable Payment Method"
                description={disableTarget ? `${disableTarget.name} will no longer be offered to users for deposits or withdrawals.` : undefined}
                confirmLabel="Disable"
                confirmVariant="danger"
            />
        </div>
    );
}
