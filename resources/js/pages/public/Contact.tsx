import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        // Mock submission — a real Laravel endpoint will replace this later.
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
        }, 700);
    }

    return (
        <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-text">Contact Us</h1>
                <p className="mt-3 text-text-muted">
                    Questions about your account, a deposit, or a package? Send us a message.
                </p>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-text-subtle">
                    <Mail className="size-4" /> support@silverquantx.com
                </p>
            </div>

            <Card padding="lg" className="mt-8">
                {isSent ? (
                    <div className="flex flex-col items-center py-6 text-center">
                        <CheckCircle2 className="size-10 text-success" />
                        <p className="mt-3 font-medium text-text">Message sent</p>
                        <p className="mt-1 text-sm text-text-muted">We'll get back to you as soon as possible.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Full Name" name="name" required placeholder="Jane Doe" />
                        <Input label="Email" name="email" type="email" required placeholder="you@example.com" />
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-text">Message</label>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                placeholder="How can we help?"
                                className="w-full rounded-control border border-border bg-surface-alt px-3.5 py-3 text-sm text-text placeholder:text-text-subtle outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                            />
                        </div>
                        <Button type="submit" fullWidth isLoading={isSubmitting}>
                            Send Message
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
