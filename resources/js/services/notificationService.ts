import { apiClient } from '@/services/apiClient';
import type { NotificationItem } from '@/data/notificationsSeed';

export const notificationService = {
    list(): Promise<NotificationItem[]> {
        return apiClient.get<NotificationItem[]>('/notifications');
    },

    markAsRead(id: string): Promise<NotificationItem[]> {
        return apiClient.post<NotificationItem[]>(`/notifications/${id}/read`);
    },

    markAllAsRead(): Promise<NotificationItem[]> {
        return apiClient.post<NotificationItem[]>('/notifications/read-all');
    },

    // --- Admin-scoped ---

    listAdmin(): Promise<NotificationItem[]> {
        return apiClient.get<NotificationItem[]>('/admin/notifications');
    },

    markAdminAsRead(id: string): Promise<NotificationItem[]> {
        return apiClient.post<NotificationItem[]>(`/admin/notifications/${id}/read`);
    },

    markAllAdminAsRead(): Promise<NotificationItem[]> {
        return apiClient.post<NotificationItem[]>('/admin/notifications/read-all');
    },
};
