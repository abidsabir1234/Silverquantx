import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { adminAccountService } from '@/services/adminAccountService';
import type { AdminAccount, AdminRole } from '@/data/adminAccountsSeed';

export interface AdminAccountFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
    editingAccount: AdminAccount | null;
}

const ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'support', label: 'Support' },
];

export function AdminAccountFormModal({ isOpen, onClose, onSaved, editingAccount }: AdminAccountFormModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<AdminRole>('support');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editingAccount) {
            setName(editingAccount.name);
            setEmail(editingAccount.email);
            setRole(editingAccount.role);
        } else {
            setName('');
            setEmail('');
            setRole('support');
        }
    }, [editingAccount, isOpen]);

    async function handleSave() {
        setIsSaving(true);
        try {
            if (editingAccount) {
                await adminAccountService.update(editingAccount.id, { name, email, role });
            } else {
                await adminAccountService.create({ name, email, role, status: 'active' });
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
            title={editingAccount ? 'Edit Admin' : 'Create Admin'}
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
                <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as AdminRole)}
                        className="h-11 w-full rounded-control border border-border bg-surface-alt px-3.5 text-sm text-text outline-none transition-colors duration-150 focus:border-accent focus:ring-1 focus:ring-accent"
                    >
                        {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </Modal>
    );
}
