import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { LoadingState } from '@/components/ui/LoadingState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { AdminAccountFormModal } from '@/components/admin/AdminAccountFormModal';
import { adminAccountService } from '@/services/adminAccountService';
import type { AdminAccount, AdminRole } from '@/data/adminAccountsSeed';

const ROLE_LABEL: Record<AdminRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    support: 'Support',
};

export default function AdminUsers() {
    const [accounts, setAccounts] = useState<AdminAccount[] | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<AdminAccount | null>(null);
    const [suspendTarget, setSuspendTarget] = useState<AdminAccount | null>(null);

    function refresh() {
        adminAccountService.list().then(setAccounts);
    }

    useEffect(refresh, []);

    function openCreate() {
        setEditingAccount(null);
        setIsFormOpen(true);
    }

    function openEdit(account: AdminAccount) {
        setEditingAccount(account);
        setIsFormOpen(true);
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button leftIcon={<Plus className="size-4" />} onClick={openCreate}>
                    Create Admin
                </Button>
            </div>

            <Card padding="none">
                {!accounts ? (
                    <LoadingState />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Name</TableHeadCell>
                                <TableHeadCell>Email</TableHeadCell>
                                <TableHeadCell>Role</TableHeadCell>
                                <TableHeadCell>Last Login</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell className="font-medium">{account.name}</TableCell>
                                    <TableCell className="text-text-muted">{account.email}</TableCell>
                                    <TableCell className="text-text-muted">{ROLE_LABEL[account.role]}</TableCell>
                                    <TableCell className="text-text-muted">
                                        {new Date(account.lastLoginAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={account.status === 'active' ? 'active' : 'suspended'}>{account.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Dropdown
                                            items={[
                                                { label: 'Edit', onClick: () => openEdit(account) },
                                                account.status === 'active'
                                                    ? {
                                                          label: 'Suspend',
                                                          destructive: true,
                                                          onClick: () => setSuspendTarget(account),
                                                      }
                                                    : {
                                                          label: 'Activate',
                                                          onClick: () => adminAccountService.setStatus(account.id, 'active').then(refresh),
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

            <AdminAccountFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSaved={refresh} editingAccount={editingAccount} />

            <ConfirmModal
                isOpen={suspendTarget !== null}
                onClose={() => setSuspendTarget(null)}
                onConfirm={async () => {
                    if (!suspendTarget) return;
                    await adminAccountService.setStatus(suspendTarget.id, 'suspended');
                    refresh();
                    setSuspendTarget(null);
                }}
                title="Suspend Admin"
                description={suspendTarget ? `${suspendTarget.name} will lose access to the admin panel until reactivated.` : undefined}
                confirmLabel="Suspend Admin"
                confirmVariant="danger"
            />
        </div>
    );
}
