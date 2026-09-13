import { apiClient, withUserId } from '@/services/apiClient';
import type { BonusHoursSummary, ReferralEntry, ReferralActivityPoint } from '@/data/referralSeed';

export const referralService = {
    /** Pass `userId` to view another account's bonus hours (e.g. the admin's user-detail page). */
    getBonusHoursSummary(userId?: string): Promise<BonusHoursSummary> {
        return apiClient.get<BonusHoursSummary>(withUserId('/bonus-hours', userId));
    },

    getReferralStats(userId?: string): Promise<{ totalReferrals: number; activeReferrals: number; bonusHours: number; pendingBonusHours: number }> {
        return apiClient.get(withUserId('/referrals/stats', userId));
    },

    /** Pass `userId` to view another account's referrals (e.g. the admin's user-detail page); defaults to the current session user. */
    getReferralList(userId?: string): Promise<ReferralEntry[]> {
        return apiClient.get<ReferralEntry[]>(withUserId('/referrals', userId));
    },

    getReferralActivity(userId?: string): Promise<ReferralActivityPoint[]> {
        return apiClient.get<ReferralActivityPoint[]>(withUserId('/referrals/activity', userId));
    },

    /** Claims all currently-eligible, not-yet-claimed referral bonus hours at once. */
    claimBonusHours(): Promise<BonusHoursSummary> {
        return apiClient.post<BonusHoursSummary>('/referrals/claim-bonus-hours');
    },

    // --- Admin-scoped ---

    /** Every customer's bonus hours, summed — the platform-wide total shown on the admin Bonus Hours page. */
    getAllBonusHoursSummary(): Promise<BonusHoursSummary> {
        return apiClient.get<BonusHoursSummary>('/admin/referrals/bonus-hours-summary');
    },

    /** Every referred customer platform-wide, regardless of who referred them. */
    getAllReferrals(): Promise<ReferralEntry[]> {
        return apiClient.get<ReferralEntry[]>('/admin/referrals');
    },

    setReferralStatus(id: string, status: ReferralEntry['status']): Promise<ReferralEntry[]> {
        return apiClient.post<ReferralEntry[]>(`/admin/referrals/${id}/status`, { status });
    },

    setBonusStatus(id: string, bonusStatus: ReferralEntry['bonusStatus']): Promise<ReferralEntry[]> {
        return apiClient.post<ReferralEntry[]>(`/admin/referrals/${id}/bonus-status`, { bonusStatus });
    },
};
