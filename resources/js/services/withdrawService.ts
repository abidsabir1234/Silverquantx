import { apiClient } from '@/services/apiClient';
import { primeUserCache } from '@/utils/resolveUser';
import type { Transaction } from '@/data/transactions';

export type WithdrawMethod = 'Bank Transfer' | 'Easypaisa' | 'JazzCash' | 'Crypto' | 'USDT';

export interface WithdrawPayload {
    amount: number;
    method: WithdrawMethod;
    accountDetails: string;
}

export const METHOD_FEES: Record<WithdrawMethod, { feePercent: number; processingTime: string }> = {
    'Bank Transfer': { feePercent: 1, processingTime: '1-2 business days' },
    Easypaisa: { feePercent: 1.5, processingTime: 'Within 24 hours' },
    JazzCash: { feePercent: 1.5, processingTime: 'Within 24 hours' },
    Crypto: { feePercent: 0.5, processingTime: '30-60 minutes' },
    USDT: { feePercent: 0.5, processingTime: '30-60 minutes' },
};

type AdminTransaction = Transaction & { userName: string; userEmail: string };

export const withdrawService = {
    submitWithdrawal(payload: WithdrawPayload): Promise<Transaction> {
        return apiClient.post<Transaction>('/withdrawals', payload);
    },

    // --- Admin-scoped ---

    async listWithdrawals(): Promise<Transaction[]> {
        const withdrawals = await apiClient.get<AdminTransaction[]>('/admin/withdrawals');
        primeUserCache(withdrawals.map((w) => ({ id: w.userId, name: w.userName, email: w.userEmail })));
        return withdrawals;
    },

    approveWithdrawal(id: string): Promise<Transaction> {
        return apiClient.post<Transaction>(`/admin/withdrawals/${id}/approve`);
    },

    processWithdrawal(id: string): Promise<Transaction> {
        return apiClient.post<Transaction>(`/admin/withdrawals/${id}/process`);
    },

    rejectWithdrawal(id: string): Promise<Transaction> {
        return apiClient.post<Transaction>(`/admin/withdrawals/${id}/reject`);
    },
};
