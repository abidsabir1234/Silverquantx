export type AdminRole = 'super_admin' | 'admin' | 'support';

export interface AdminAccount {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    status: 'active' | 'suspended';
    lastLoginAt: string;
}

export const adminAccountsSeed: AdminAccount[] = [
    { id: 'admin-1', name: 'Platform Admin', email: 'admin@quantx123gmail.com', role: 'super_admin', status: 'active', lastLoginAt: '2026-09-02T08:00:00.000Z' },
];
