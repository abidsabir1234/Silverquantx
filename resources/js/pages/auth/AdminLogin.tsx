import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLogin() {
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Already signed in as admin — skip straight past the login form.
    if (isAuthenticated && user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await login(email, password, 'admin');
            navigate('/admin', { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-bg-alt to-[#080B0A] px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8 flex flex-col items-center gap-3 text-center">
                    <Logo size="lg" />
                    <span className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                        <ShieldCheck className="size-3.5" />
                        Admin Portal
                    </span>
                </div>

                <div className="rounded-card border border-border-subtle bg-surface/70 p-8 shadow-elevated backdrop-blur-xl">
                    <h1 className="text-lg font-semibold text-text">Administrator Sign In</h1>
                    <p className="mt-1 text-sm text-text-muted">Restricted access — this area is for platform administrators only.</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <Input
                            label="Admin Email"
                            type="email"
                            leftIcon={<Mail className="size-4" />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="username"
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            leftIcon={<Lock className="size-4" />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />

                        {error && <p className="text-sm text-danger">{error}</p>}

                        <Button type="submit" fullWidth isLoading={isSubmitting}>
                            Sign In to Admin Panel
                        </Button>
                    </form>
                </div>

                <p className="mt-6 text-center text-xs text-text-subtle">
                    Not an administrator?{' '}
                    <Link to="/login" className="text-text-muted underline hover:text-text">
                        Go to the customer login
                    </Link>
                </p>
            </div>
        </div>
    );
}
