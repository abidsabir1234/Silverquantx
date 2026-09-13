export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
}

/** A brand-new account starts with a single welcome note, not a demo activity feed. */
export function createWelcomeNotifications(): NotificationItem[] {
    return [
        {
            id: `notif-welcome-${Date.now()}`,
            title: 'Welcome to SilverQuantX',
            message: 'Your account is ready. Add funds to activate your first package and start an earning cycle.',
            createdAt: new Date().toISOString(),
            read: false,
        },
    ];
}
