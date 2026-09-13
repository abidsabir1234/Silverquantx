import { apiClient, withUserId } from '@/services/apiClient';
import type { PackagePlan } from '@/data/packages';
import type { CurrentPackage } from '@/data/currentPackage';
import type { PackageHistoryEntry } from '@/data/packageHistorySeed';

export const packageService = {
    getPackages(): Promise<PackagePlan[]> {
        return apiClient.get<PackagePlan[]>('/packages');
    },

    /** Pass `userId` to view another account's package (e.g. the admin's user-detail page). */
    getCurrentPackage(userId?: string): Promise<CurrentPackage | null> {
        return apiClient.get<CurrentPackage | null>(withUserId('/packages/current', userId));
    },

    getPackageHistory(userId?: string): Promise<PackageHistoryEntry[]> {
        return apiClient.get<PackageHistoryEntry[]>(withUserId('/packages/history', userId));
    },

    activatePackage(planId: string): Promise<CurrentPackage> {
        return apiClient.post<CurrentPackage>('/packages/activate', { planId });
    },

    // --- Admin-scoped ---

    createPackage(plan: Omit<PackagePlan, 'id'>): Promise<PackagePlan[]> {
        return apiClient.post<PackagePlan[]>('/admin/packages', plan);
    },

    updatePackage(planId: string, updates: Partial<Omit<PackagePlan, 'id'>>): Promise<PackagePlan[]> {
        return apiClient.put<PackagePlan[]>(`/admin/packages/${planId}`, updates);
    },

    setPackageStatus(planId: string, status: PackagePlan['status']): Promise<PackagePlan[]> {
        return apiClient.post<PackagePlan[]>(`/admin/packages/${planId}/status`, { status });
    },
};
