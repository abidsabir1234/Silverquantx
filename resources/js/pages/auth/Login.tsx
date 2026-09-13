import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await login(identifier, password, 'user');
            const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
            navigate(from ?? '/app', { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card padding="lg">
            <CardHeader className="flex-col items-start">
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Log in to manage your packages and earnings.</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Email / Mobile"
                    leftIcon={<Mail className="size-4" />}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
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

                <div className="flex items-center justify-end">
                    <Link to="/forgot-password" className="text-sm text-text-muted hover:text-text">
                        Forgot Password?
                    </Link>
                </div>

                <Button type="submit" fullWidth isLoading={isSubmitting}>
                    Login
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-text-muted">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-text hover:underline">
                    Create Account
                </Link>
            </p>
        </Card>
    );
}
