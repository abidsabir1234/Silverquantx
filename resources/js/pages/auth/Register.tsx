import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Lock, Ticket, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/hooks/useAuth';

const STEPS = ['Personal Details', 'Secure Your Account', 'Review & Confirm'] as const;

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const referralFromUrl = searchParams.get('ref') ?? '';

    const [step, setStep] = useState(0);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [referralCode, setReferralCode] = useState(referralFromUrl);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function validateStep(current: number): string | null {
        if (current === 0) {
            if (!fullName.trim() || !email.trim() || !mobile.trim()) {
                return 'Please fill in all fields.';
            }
        }
        if (current === 1) {
            if (!password || !confirmPassword) return 'Please fill in all fields.';
            if (password !== confirmPassword) return 'Passwords do not match.';
        }
        return null;
    }

    function goNext() {
        const validationError = validateStep(step);
        if (validationError) {
            setError(validationError);
            return;
        }
        setError(null);
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }

    function goBack() {
        setError(null);
        setStep((s) => Math.max(s - 1, 0));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (!agreeToTerms) {
            setError('Please agree to the Terms of Service and Risk Disclosure to continue.');
            return;
        }

        setIsSubmitting(true);
        try {
            await register({ fullName, email, mobile, password, referralCode });
            navigate('/register/deposit', { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card padding="lg">
            <CardHeader className="flex-col items-start">
                <CardTitle>Create your account</CardTitle>
                <CardDescription>Step {step + 1} of {STEPS.length}: {STEPS[step]}</CardDescription>
            </CardHeader>

            <ProgressBar value={((step + 1) / STEPS.length) * 100} className="mb-6" />

            {referralFromUrl && (
                <div className="mb-4 flex items-center gap-2 rounded-control border border-accent/30 bg-accent/10 px-3.5 py-2.5 text-sm text-accent">
                    <Ticket className="size-4" />
                    Referral Code: <span className="font-semibold">{referralFromUrl}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {step === 0 && (
                    <>
                        <Input
                            label="Full Name"
                            leftIcon={<User className="size-4" />}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            autoComplete="name"
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            leftIcon={<Mail className="size-4" />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                        <Input
                            label="Mobile"
                            type="tel"
                            leftIcon={<Phone className="size-4" />}
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            autoComplete="tel"
                            required
                        />
                    </>
                )}

                {step === 1 && (
                    <>
                        <Input
                            label="Password"
                            type="password"
                            leftIcon={<Lock className="size-4" />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            leftIcon={<Lock className="size-4" />}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        {!referralFromUrl && (
                            <Input
                                label="Referral Code (optional)"
                                leftIcon={<Ticket className="size-4" />}
                                placeholder="ABC123"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                            />
                        )}
                    </>
                )}

                {step === 2 && (
                    <>
                        <dl className="grid grid-cols-1 gap-3 rounded-control border border-border-subtle bg-surface-alt p-4 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-text-subtle">Full Name</dt>
                                <dd className="mt-0.5 font-medium text-text">{fullName}</dd>
                            </div>
                            <div>
                                <dt className="text-text-subtle">Email</dt>
                                <dd className="mt-0.5 font-medium text-text">{email}</dd>
                            </div>
                            <div>
                                <dt className="text-text-subtle">Mobile</dt>
                                <dd className="mt-0.5 font-medium text-text">{mobile}</dd>
                            </div>
                            {referralCode && (
                                <div>
                                    <dt className="text-text-subtle">Referral Code</dt>
                                    <dd className="mt-0.5 font-medium text-text">{referralCode}</dd>
                                </div>
                            )}
                        </dl>

                        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-text-muted">
                            <input
                                type="checkbox"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="mt-0.5 size-4 shrink-0 rounded border-border accent-accent"
                            />
                            <span>
                                I agree to the{' '}
                                <Link to="/terms" target="_blank" className="text-text underline hover:text-accent">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/risk-disclosure" target="_blank" className="text-text underline hover:text-accent">
                                    Risk Disclosure
                                </Link>
                                .
                            </span>
                        </label>
                    </>
                )}

                {error && <p className="text-sm text-danger">{error}</p>}

                <div className="flex items-center gap-3 pt-1">
                    {step > 0 && (
                        <Button type="button" variant="secondary" onClick={goBack} leftIcon={<ArrowLeft className="size-4" />}>
                            Back
                        </Button>
                    )}
                    {step < STEPS.length - 1 ? (
                        <Button type="button" fullWidth onClick={goNext} rightIcon={<ArrowRight className="size-4" />}>
                            Next
                        </Button>
                    ) : (
                        <Button type="submit" fullWidth isLoading={isSubmitting} rightIcon={<Check className="size-4" />}>
                            Create Account
                        </Button>
                    )}
                </div>
            </form>

            <p className="mt-6 text-center text-sm text-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-text hover:underline">
                    Login
                </Link>
            </p>
        </Card>
    );
}
