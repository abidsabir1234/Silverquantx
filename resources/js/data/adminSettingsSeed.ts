export interface AdminSettings {
    general: {
        siteName: string;
        supportEmail: string;
        maintenanceMode: boolean;
    };
    brand: {
        tagline: string;
        primaryColorHex: string;
    };
    notifications: {
        emailAlertsEnabled: boolean;
        smsAlertsEnabled: boolean;
        newUserAlerts: boolean;
    };
    security: {
        twoFactorRequired: boolean;
        sessionTimeoutMinutes: number;
    };
}

export const adminSettingsSeed: AdminSettings = {
    general: {
        siteName: 'SilverQuantX',
        supportEmail: 'support@silverquantx.com',
        maintenanceMode: false,
    },
    brand: {
        tagline: 'Premium earning, simplified.',
        primaryColorHex: '#C7CDD6',
    },
    notifications: {
        emailAlertsEnabled: true,
        smsAlertsEnabled: false,
        newUserAlerts: true,
    },
    security: {
        twoFactorRequired: false,
        sessionTimeoutMinutes: 60,
    },
};
