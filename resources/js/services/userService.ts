import { apiClient } from '@/services/apiClient';
import type { MockUser } from '@/data/users';
import type { AdminUserRow } from '@/data/adminUsersSeed';

type ProfileUpdate = Partial<Pick<MockUser, 'fullName' | 'mobile' | 'email'>>;

export const userService = {
    /** `user` is unused — the account being updated is inferred from the auth token — kept for call-site compatibility. */
    async updateProfile(user: MockUser, updates: ProfileUpdate): Promise<MockUser> {
        const { user: updated } = await apiClient.put<{ user: Omit<MockUser, 'passwordHash'> }>('/profile', updates);
        return { ...updated, passwordHash: '' };
    },

    // --- Admin-scoped ---

    listAdminUsers(): Promise<AdminUserRow[]> {
        return apiClient.get<AdminUserRow[]>('/admin/users');
    },

    getAdminUser(userId: string): Promise<AdminUserRow | null> {
        return apiClient.get<AdminUserRow | null>(`/admin/users/${userId}`);
    },

    setUserStatus(userId: string, status: AdminUserRow['status']): Promise<AdminUserRow[]> {
        return apiClient.post<AdminUserRow[]>(`/admin/users/${userId}/status`, { status });
    },

    updateAdminUser(userId: string, updates: Partial<Pick<AdminUserRow, 'name' | 'email' | 'mobile'>>): Promise<AdminUserRow[]> {
        return apiClient.put<AdminUserRow[]>(`/admin/users/${userId}`, updates);
    },
};
