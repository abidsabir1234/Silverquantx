import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const SUBJECTS = ['Deposit issue', 'Withdrawal issue', 'Package question', 'Account issue', 'Other'];

export default function Support() {
    const [subject, setSubject] = useState(SUBJECTS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
        }, 700);
    }

    return (
        <Card padding="lg" className="mx-auto max-w-lg">
            <CardHeader className="flex-col items-start">
                <CardTitle>Support</CardTitle>
                <CardDescription>Open a support ticket and our team will get back to you.</CardDescription>
            </CardHeader>

            {isSent ? (
                <div className="flex flex-col items-center py-6 text-center">
                    <CheckCircle2 className="size-10 text-success" />
                    <p className="mt-3 font-medium text-text">Ticket submitted</p>
                    <p className="mt-1 text-sm text-text-muted">We'll respond to your account email shortly.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">Subject</label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="h-11 w-full rounded-control border border-border bg-surface-alt px-3.5 text-sm text-text outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        >
                            {SUBJECTS.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-text">Message</label>
                        <textarea
                            required
                            rows={5}
                            placeholder="Describe your issue…"
                            className="w-full rounded-control border border-border bg-surface-alt px-3.5 py-3 text-sm text-text placeholder:text-text-subtle outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                        />
                    </div>
                    <Button type="submit" fullWidth isLoading={isSubmitting}>
                        Submit Ticket
                    </Button>
                </form>
            )}
        </Card>
    );
}
