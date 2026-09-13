import { apiClient } from '@/services/apiClient';
import type { AdminAccount } from '@/data/adminAccountsSeed';

export const adminAccountService = {
    list(): Promise<AdminAccount[]> {
        return apiClient.get<AdminAccount[]>('/admin/admin-accounts');
    },

    create(account: Omit<AdminAccount, 'id' | 'lastLoginAt'>): Promise<AdminAccount[]> {
        return apiClient.post<AdminAccount[]>('/admin/admin-accounts', account);
    },

    update(id: string, updates: Partial<Omit<AdminAccount, 'id'>>): Promise<AdminAccount[]> {
        return apiClient.put<AdminAccount[]>(`/admin/admin-accounts/${id}`, updates);
    },

    setStatus(id: string, status: AdminAccount['status']): Promise<AdminAccount[]> {
        return apiClient.post<AdminAccount[]>(`/admin/admin-accounts/${id}/status`, { status });
    },
};
