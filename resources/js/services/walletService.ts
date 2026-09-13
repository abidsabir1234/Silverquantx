import { apiClient, withUserId } from '@/services/apiClient';
import type { WalletSummary } from '@/data/walletSeed';

export const walletService = {
    getSummary(userId?: string): Promise<WalletSummary> {
        return apiClient.get<WalletSummary>(withUserId('/wallet', userId));
    },
};
