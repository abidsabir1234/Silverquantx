import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { botService } from '@/services/botService';
import type { BotPassPlan } from '@/data/botPassPlansSeed';

export interface BotPassFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    editingPlan: BotPassPlan | null;
}

export function BotPassFormModal({ isOpen, onClose, onSaved, editingPlan }: BotPassFormModalProps) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [durationDays, setDurationDays] = useState('');
    const [cycleDurationMinutes, setCycleDurationMinutes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editingPlan) {
            setName(editingPlan.name);
            setPrice(String(editingPlan.price));
            setDurationDays(String(editingPlan.durationDays));
            setCycleDurationMinutes(String(editingPlan.cycleDurationMinutes));
        } else {
            setName('');
            setPrice('');
            setDurationDays('');
            setCycleDurationMinutes('');
        }
    }, [editingPlan, isOpen]);

    async function handleSave() {
        setIsSaving(true);
        try {
            const payload = {
                name,
                price: Number(price),
                durationDays: Number(durationDays),
                cycleDurationMinutes: Number(cycleDurationMinutes),
                status: 'active' as const,
            };
            if (editingPlan) {
                await botService.updateBotPassPlan(editingPlan.id, payload);
            } else {
                await botService.createBotPassPlan(payload);
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
            title={editingPlan ? 'Edit Bot Pass' : 'Create Bot Pass'}
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
                <Input label="Plan Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Price ($)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <Input label="Duration (days)" type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} required />
                <Input
                    label="Cycle Duration (minutes)"
                    type="number"
                    value={cycleDurationMinutes}
                    onChange={(e) => setCycleDurationMinutes(e.target.value)}
                    required
                />
            </div>
        </Modal>
    );
}
