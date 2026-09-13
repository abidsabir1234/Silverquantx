import { apiClient } from '@/services/apiClient';
import type { EarningCycle } from '@/data/cycleSeed';

export const earningService = {
    getCurrentCycle(): Promise<EarningCycle> {
        return apiClient.get<EarningCycle>('/earning-cycle');
    },

    startCycle(): Promise<EarningCycle> {
        return apiClient.post<EarningCycle>('/earning-cycle/start');
    },

    claimCycle(): Promise<{ cycle: EarningCycle; amountClaimed: number }> {
        return apiClient.post<{ cycle: EarningCycle; amountClaimed: number }>('/earning-cycle/claim');
    },
};
