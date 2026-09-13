import { authService } from '@/services/authService';

/**
 * Suffixes a base localStorage key with a user id so each account gets its own
 * wallet/package/notifications/etc. instead of sharing one global record.
 * Falls back to the current session's user, since every caller runs while a
 * user is logged in — pass `userId` explicitly for admin-driven mutations
 * that target a different account than the one currently signed in.
 */
export function scopedKey(base: string, userId?: string): string {
    const id = userId ?? authService.getCurrentUser()?.id ?? 'guest';
    return `${base}:${id}`;
}
