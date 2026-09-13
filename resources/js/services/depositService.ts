import { apiClient } from '@/services/apiClient';
import { primeUserCache } from '@/utils/resolveUser';
import type { Transaction } from '@/data/transactions';

export type DepositCurrency = 'PKR' | 'USD';
export type DepositMethod = 'Easypaisa' | 'JazzCash' | 'Bank Transfer' | 'Crypto' | 'USDT';

export interface DepositPayload {
    amount: number;
    currency: DepositCurrency;
    method: DepositMethod;
    reference: string;
    proofFile: File;
}

type AdminTransaction = Transaction & { userName: string; userEmail: string };

export const depositService = {
    submitDeposit(payload: DepositPayload): Promise<Transaction> {
        const form = new FormData();
        form.set('amount', String(payload.amount));
        form.set('currency', payload.currency);
        form.set('method', payload.method);
        form.set('reference', payload.reference);
        form.set('proof', payload.proofFile);

        return apiClient.post<Transaction>('/deposits', form);
    },

    // --- Admin-scoped ---

    async listDeposits(): Promise<Transaction[]> {
        const deposits = await apiClient.get<AdminTransaction[]>('/admin/deposits');
        primeUserCache(deposits.map((d) => ({ id: d.userId, name: d.userName, email: d.userEmail })));
        return deposits;
    },

    approveDeposit(id: string): Promise<Transaction> {
        return apiClient.post<Transaction>(`/admin/deposits/${id}/approve`);
    },

    rejectDeposit(id: string): Promise<Transaction> {
        return apiClient.post<Transaction>(`/admin/deposits/${id}/reject`);
    },
};
