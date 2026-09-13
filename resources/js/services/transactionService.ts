import { apiClient } from '@/services/apiClient';
import { primeUserCache } from '@/utils/resolveUser';
import type { Transaction } from '@/data/transactions';

type AdminTransaction = Transaction & { userName: string; userEmail: string };

export const transactionService = {
    /** The current session user's own transactions — used by user-facing Wallet/Transactions pages. */
    list(): Promise<Transaction[]> {
        return apiClient.get<Transaction[]>('/transactions');
    },

    // --- Admin-scoped ---

    /** Every user's transactions, unfiltered — used by admin Deposits/Withdrawals/Transactions pages. */
    async listAll(): Promise<Transaction[]> {
        const transactions = await apiClient.get<AdminTransaction[]>('/admin/transactions');
        primeUserCache(transactions.map((t) => ({ id: t.userId, name: t.userName, email: t.userEmail })));
        return transactions;
    },
};
