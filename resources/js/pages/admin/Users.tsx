import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Dropdown } from '@/components/ui/Dropdown';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { userService } from '@/services/userService';
import type { AdminUserRow } from '@/data/adminUsersSeed';

export default function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<AdminUserRow[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<AdminUserRow | null>(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [suspendTarget, setSuspendTarget] = useState<AdminUserRow | null>(null);

    function refresh() {
        setError(null);
        userService.listAdminUsers().then(setUsers).catch((e: Error) => setError(e.message));
    }

    useEffect(refresh, []);

    function openEdit(user: AdminUserRow) {
        setEditingUser(user);
        setEditName(user.name);
        setEditEmail(user.email);
    }

    async function handleSaveEdit() {
        if (!editingUser) return;
        setIsSaving(true);
        try {
            await userService.updateAdminUser(editingUser.id, { name: editName, email: editEmail });
            refresh();
            setEditingUser(null);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="space-y-4">
            <Card padding="none">
                {error ? (
                    <ErrorState message={error} onRetry={refresh} />
                ) : !users ? (
                    <LoadingState />
                ) : users.length === 0 ? (
                    <EmptyState title="No customers yet" description="New sign-ups will appear here automatically." />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>User</TableHeadCell>
                                <TableHeadCell>Email</TableHeadCell>
                                <TableHeadCell>Mobile</TableHeadCell>
                                <TableHeadCell>Registered</TableHeadCell>
                                <TableHeadCell>Balance</TableHeadCell>
                                <TableHeadCell>Package</TableHeadCell>
                                <TableHeadCell>Status</TableHeadCell>
                                <TableHeadCell>Referrals</TableHeadCell>
                                <TableHeadCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-text-muted">{user.email}</TableCell>
                                    <TableCell className="text-text-muted">{user.mobile}</TableCell>
                                    <TableCell className="text-text-muted">
                                        {new Date(user.registeredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell>${user.balance.toFixed(2)}</TableCell>
                                    <TableCell className="text-text-muted">{user.packageName ?? '—'}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === 'active' ? 'active' : 'suspended'}>{user.status}</Badge>
                                    </TableCell>
                                    <TableCell>{user.referrals}</TableCell>
                                    <TableCell>
                                        <Dropdown
                                            items={[
                                                { label: 'View', onClick: () => navigate(`/admin/users/${user.id}`) },
                                                { label: 'Edit', onClick: () => openEdit(user) },
                                                user.status === 'active'
                                                    ? {
                                                          label: 'Suspend',
                                                          destructive: true,
                                                          onClick: () => setSuspendTarget(user),
                                                      }
                                                    : {
                                                          label: 'Activate',
                                                          onClick: () => userService.setUserStatus(user.id, 'active').then(refresh),
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
                isOpen={editingUser !== null}
                onClose={() => setEditingUser(null)}
                title="Edit User"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setEditingUser(null)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} isLoading={isSaving}>
                            Save
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <Input label="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                    {editingUser && (
                        <Link to={`/admin/users/${editingUser.id}`} className="text-sm text-text-muted hover:text-text">
                            View full profile →
                        </Link>
                    )}
                </div>
            </Modal>

            <ConfirmModal
                isOpen={suspendTarget !== null}
                onClose={() => setSuspendTarget(null)}
                onConfirm={async () => {
                    if (!suspendTarget) return;
                    await userService.setUserStatus(suspendTarget.id, 'suspended');
                    refresh();
                    setSuspendTarget(null);
                }}
                title="Suspend User"
                description={suspendTarget ? `${suspendTarget.name} will lose access to their account until reactivated.` : undefined}
                confirmLabel="Suspend User"
                confirmVariant="danger"
            />
        </div>
    );
}
