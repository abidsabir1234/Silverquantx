import { useState } from 'react';
import type { FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function ToggleRow({ label, description, defaultChecked = true }: { label: string; description: string; defaultChecked?: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);
    return (
        <div className="flex items-center justify-between py-3">
            <div>
                <p className="text-sm font-medium text-text">{label}</p>
                <p className="text-xs text-text-muted">{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => setChecked((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-border'}`}
            >
                <span
                    className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
                />
            </button>
        </div>
    );
}

export default function Settings() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSavedMessage('Password updated.');
        }, 600);
    }

    return (
        <div className="mx-auto max-w-lg space-y-6">
            <Card padding="lg">
                <CardHeader className="flex-col items-start">
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Change your account password.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Current Password" type="password" required />
                    <Input label="New Password" type="password" required />
                    <Input label="Confirm New Password" type="password" required />
                    {savedMessage && <p className="text-sm text-success">{savedMessage}</p>}
                    <Button type="submit" isLoading={isSubmitting}>
                        Update Password
                    </Button>
                </form>
            </Card>

            <Card padding="lg">
                <CardHeader className="flex-col items-start">
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose what you'd like to be notified about.</CardDescription>
                </CardHeader>
                <div className="divide-y divide-border-subtle">
                    <ToggleRow label="Earning cycle alerts" description="Claim available, claim successful, cycle updates." />
                    <ToggleRow label="Wallet activity" description="Deposit approvals, withdrawal updates." />
                    <ToggleRow label="Referral activity" description="New referrals, bonus hours received." />
                </div>
            </Card>
        </div>
    );
}
