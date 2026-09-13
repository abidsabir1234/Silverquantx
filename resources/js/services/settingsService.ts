import { apiClient } from '@/services/apiClient';
import type { ExchangeRate } from '@/data/exchangeRateSeed';
import type { ReferralRules } from '@/data/referralRulesSeed';
import type { PaymentMethodConfig } from '@/data/paymentMethodsSeed';
import type { AdminSettings } from '@/data/adminSettingsSeed';

export const settingsService = {
    getExchangeRate(): Promise<ExchangeRate> {
        return apiClient.get<ExchangeRate>('/settings/exchange-rate');
    },

    /** `updatedBy` is derived server-side from the authenticated admin; kept in the signature for call-site compatibility. */
    updateExchangeRate(newRate: number, _updatedBy?: string): Promise<ExchangeRate> {
        return apiClient.put<ExchangeRate>('/admin/exchange-rate', { rate: newRate });
    },

    // --- Referral rules (admin-scoped) ---

    getReferralRules(): Promise<ReferralRules> {
        return apiClient.get<ReferralRules>('/admin/referral-rules');
    },

    updateReferralRules(rules: ReferralRules): Promise<ReferralRules> {
        return apiClient.put<ReferralRules>('/admin/referral-rules', rules);
    },

    // --- Payment methods ---

    getPaymentMethods(): Promise<PaymentMethodConfig[]> {
        return apiClient.get<PaymentMethodConfig[]>('/settings/payment-methods');
    },

    updatePaymentMethod(id: string, updates: Partial<Omit<PaymentMethodConfig, 'id'>>): Promise<PaymentMethodConfig[]> {
        return apiClient.put<PaymentMethodConfig[]>(`/admin/payment-methods/${id}`, updates);
    },

    // --- General admin settings ---

    getAdminSettings(): Promise<AdminSettings> {
        return apiClient.get<AdminSettings>('/admin/settings');
    },

    updateAdminSettings(settings: AdminSettings): Promise<AdminSettings> {
        return apiClient.put<AdminSettings>('/admin/settings', settings);
    },
};
