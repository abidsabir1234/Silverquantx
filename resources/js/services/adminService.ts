import { apiClient } from '@/services/apiClient';
import type { AdminSummary, ChartPoint } from '@/data/adminStats';

export const adminService = {
    getDashboardSummary(): Promise<AdminSummary> {
        return apiClient.get<AdminSummary>('/admin/dashboard/summary');
    },

    getCharts(): Promise<Record<string, ChartPoint[]>> {
        return apiClient.get<Record<string, ChartPoint[]>>('/admin/dashboard/charts');
    },
};
