import { apiClient } from '@/services/apiClient';
import type { PlatformStat } from '@/data/platformStats';

export const statsService = {
    getPlatformStats(): Promise<PlatformStat[]> {
        return apiClient.get<PlatformStat[]>('/stats/platform');
    },
};
