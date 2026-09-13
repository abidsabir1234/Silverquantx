import { apiClient } from '@/services/apiClient';
import type { BotPass } from '@/data/botPassSeed';
import type { BotPassPlan } from '@/data/botPassPlansSeed';

export const botService = {
    getBotPass(): Promise<BotPass> {
        return apiClient.get<BotPass>('/bot-pass');
    },

    startCycle(): Promise<BotPass> {
        return apiClient.post<BotPass>('/bot-pass/start');
    },

    claimCycle(): Promise<{ pass: BotPass; amountClaimed: number }> {
        return apiClient.post<{ pass: BotPass; amountClaimed: number }>('/bot-pass/claim');
    },

    // --- Admin-scoped: Bot Pass plan catalog ---

    getBotPassPlans(): Promise<BotPassPlan[]> {
        return apiClient.get<BotPassPlan[]>('/admin/bot-pass-plans');
    },

    createBotPassPlan(plan: Omit<BotPassPlan, 'id'>): Promise<BotPassPlan[]> {
        return apiClient.post<BotPassPlan[]>('/admin/bot-pass-plans', plan);
    },

    updateBotPassPlan(planId: string, updates: Partial<Omit<BotPassPlan, 'id'>>): Promise<BotPassPlan[]> {
        return apiClient.put<BotPassPlan[]>(`/admin/bot-pass-plans/${planId}`, updates);
    },

    setBotPassPlanStatus(planId: string, status: BotPassPlan['status']): Promise<BotPassPlan[]> {
        return apiClient.post<BotPassPlan[]>(`/admin/bot-pass-plans/${planId}/status`, { status });
    },
};
