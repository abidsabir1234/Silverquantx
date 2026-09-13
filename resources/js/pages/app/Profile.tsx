import { useState } from 'react';
import type { FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [fullName, setFullName] = useState(user?.fullName ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [mobile, setMobile] = useState(user?.mobile ?? '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        setSavedMessage(null);
        try {
            const updated = await userService.updateProfile(user, { fullName, email, mobile });
            updateUser(updated);
            setSavedMessage('Profile updated.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card padding="lg" className="mx-auto max-w-lg">
            <CardHeader className="flex-col items-start">
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your account details.</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required />

                <Input label="Referral Code" value={user?.referralCode ?? ''} disabled />

                {savedMessage && <p className="text-sm text-success">{savedMessage}</p>}

                <Button type="submit" isLoading={isSubmitting}>
                    Save Changes
                </Button>
            </form>
        </Card>
    );
}
