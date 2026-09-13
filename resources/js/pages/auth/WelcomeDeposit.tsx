import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DepositForm } from '@/components/app/DepositForm';

export default function WelcomeDeposit() {
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);

    if (isSuccess) {
        return (
            <Card padding="lg" className="text-center">
                <CheckCircle2 className="mx-auto size-10 text-success" />
                <p className="mt-3 font-medium text-text">Deposit submitted</p>
                <p className="mt-1 text-sm text-text-muted">
                    We're reviewing it now — your wallet will be credited once it's approved, and you can activate a
                    package as soon as funds land.
                </p>
                <Button fullWidth className="mt-6" onClick={() => navigate('/app', { replace: true })}>
                    Go to Dashboard
                </Button>
            </Card>
        );
    }

    return (
        <Card padding="lg">
            <CardHeader className="flex-col items-start">
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    <Sparkles className="size-3.5" />
                    Account created
                </span>
                <CardTitle>Add funds to activate your first package</CardTitle>
                <CardDescription>
                    Your account is ready. Make a deposit now to activate a package and start your first earning
                    cycle — or skip for now and do it later from your dashboard.
                </CardDescription>
            </CardHeader>

            <DepositForm submitLabel="Deposit & Continue" onSuccess={() => setIsSuccess(true)} />

            <button
                type="button"
                onClick={() => navigate('/app', { replace: true })}
                className="mt-4 w-full text-center text-sm text-text-muted hover:text-text"
            >
                Skip for now — I'll deposit later
            </button>
        </Card>
    );
}
