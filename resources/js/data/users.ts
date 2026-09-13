export type UserRole = 'user' | 'admin';

export interface MockUser {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
    passwordHash: string; // mock only — never a real hash, replaced by real backend auth later
    role: UserRole;
    referralCode: string;
    referredBy?: string;
    createdAt: string;
}

/** The one real admin account. Every other account is created through registration — no seeded demo customers. */
export const users: MockUser[] = [
    {
        id: 'admin-1',
        fullName: 'Platform Admin',
        email: 'admin@quantx123gmail.com',
        mobile: '+92 300 0000000',
        passwordHash: 'password123',
        role: 'admin',
        referralCode: 'ADMIN01',
        createdAt: '2026-01-01T09:00:00.000Z',
    },
];
