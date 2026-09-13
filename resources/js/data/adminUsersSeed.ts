export interface AdminUserRow {
    id: string;
    name: string;
    email: string;
    mobile: string;
    registeredAt: string;
    balance: number;
    packageName: string | null;
    status: 'active' | 'suspended';
    referrals: number;
}
