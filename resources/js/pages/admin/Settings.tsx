import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { settingsService } from '@/services/settingsService';
import type { AdminSettings } from '@/data/adminSettingsSeed';

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
    return (
        <label className="flex items-center gap-2.5 text-sm text-text">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="size-4 rounded border-border accent-silver"
            />
            {label}
        </label>
    );
}

export default function Settings() {
    const [settings, setSettings] = useState<AdminSettings | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        settingsService.getAdminSettings().then(setSettings);
    }, []);

    async function handleSave() {
        if (!settings) return;
        setIsSaving(true);
        try {
            const updated = await settingsService.updateAdminSettings(settings);
            setSettings(updated);
        } finally {
            setIsSaving(false);
        }
    }

    if (!settings) return <LoadingState />;

    const saveBar = (
        <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} isLoading={isSaving}>
                Save Changes
            </Button>
        </div>
    );

    return (
        <Card>
            <Tabs
                tabs={[
                    {
                        key: 'general',
                        label: 'General',
                        content: (
                            <div className="space-y-4">
                                <Input
                                    label="Site Name"
                                    value={settings.general.siteName}
                                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteName: e.target.value } })}
                                />
                                <Input
                                    label="Support Email"
                                    type="email"
                                    value={settings.general.supportEmail}
                                    onChange={(e) => setSettings({ ...settings, general: { ...settings.general, supportEmail: e.target.value } })}
                                />
                                <Toggle
                                    label="Maintenance mode"
                                    checked={settings.general.maintenanceMode}
                                    onChange={(value) => setSettings({ ...settings, general: { ...settings.general, maintenanceMode: value } })}
                                />
                                {saveBar}
                            </div>
                        ),
                    },
                    {
                        key: 'brand',
                        label: 'Brand',
                        content: (
                            <div className="space-y-4">
                                <Input
                                    label="Tagline"
                                    value={settings.brand.tagline}
                                    onChange={(e) => setSettings({ ...settings, brand: { ...settings.brand, tagline: e.target.value } })}
                                />
                                <Input
                                    label="Primary Color"
                                    type="text"
                                    value={settings.brand.primaryColorHex}
                                    onChange={(e) => setSettings({ ...settings, brand: { ...settings.brand, primaryColorHex: e.target.value } })}
                                />
                                {saveBar}
                            </div>
                        ),
                    },
                    {
                        key: 'notifications',
                        label: 'Notifications',
                        content: (
                            <div className="space-y-4">
                                <Toggle
                                    label="Email alerts enabled"
                                    checked={settings.notifications.emailAlertsEnabled}
                                    onChange={(value) =>
                                        setSettings({ ...settings, notifications: { ...settings.notifications, emailAlertsEnabled: value } })
                                    }
                                />
                                <Toggle
                                    label="SMS alerts enabled"
                                    checked={settings.notifications.smsAlertsEnabled}
                                    onChange={(value) =>
                                        setSettings({ ...settings, notifications: { ...settings.notifications, smsAlertsEnabled: value } })
                                    }
                                />
                                <Toggle
                                    label="Notify on new user registration"
                                    checked={settings.notifications.newUserAlerts}
                                    onChange={(value) =>
                                        setSettings({ ...settings, notifications: { ...settings.notifications, newUserAlerts: value } })
                                    }
                                />
                                {saveBar}
                            </div>
                        ),
                    },
                    {
                        key: 'security',
                        label: 'Security',
                        content: (
                            <div className="space-y-4">
                                <Toggle
                                    label="Require two-factor authentication for admins"
                                    checked={settings.security.twoFactorRequired}
                                    onChange={(value) => setSettings({ ...settings, security: { ...settings.security, twoFactorRequired: value } })}
                                />
                                <Input
                                    label="Session Timeout (minutes)"
                                    type="number"
                                    value={settings.security.sessionTimeoutMinutes}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            security: { ...settings.security, sessionTimeoutMinutes: Number(e.target.value) },
                                        })
                                    }
                                />
                                {saveBar}
                            </div>
                        ),
                    },
                ]}
            />
        </Card>
    );
}
