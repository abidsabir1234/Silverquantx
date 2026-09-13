import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { packageService } from '@/services/packageService';
import type { PackagePlan } from '@/data/packages';

export interface PackageFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    editingPlan: PackagePlan | null;
}

export function PackageFormModal({ isOpen, onClose, onSaved, editingPlan }: PackageFormModalProps) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editingPlan) {
            setName(editingPlan.name);
            setAmount(String(editingPlan.amount));
            setDuration(String(editingPlan.duration));
            setHourlyRate(editingPlan.hourlyRate);
        } else {
            setName('');
            setAmount('');
            setDuration('');
            setHourlyRate('');
        }
    }, [editingPlan, isOpen]);

    async function handleSave() {
        setIsSaving(true);
        try {
            const payload = { name, amount: Number(amount), duration: Number(duration), hourlyRate, status: 'active' as const };
            if (editingPlan) {
                await packageService.updatePackage(editingPlan.id, payload);
            } else {
                await packageService.createPackage(payload);
            }
            onSaved();
            onClose();
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingPlan ? 'Edit Package' : 'Create Package'}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} isLoading={isSaving}>
                        Save
                    </Button>
                </>
            }
        >
            <div className="space-y-4">
                <Input label="Package Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Amount ($)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                <Input label="Duration (days)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />
                <Input label="Hourly Rate" placeholder="$0.42/hr" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} required />
            </div>
        </Modal>
    );
}
