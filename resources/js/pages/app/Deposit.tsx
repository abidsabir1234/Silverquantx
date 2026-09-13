import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { DepositForm } from '@/components/app/DepositForm';

export default function Deposit() {
    const [isSuccess, setIsSuccess] = useState(false);

    if (isSuccess) {
        return (
            <Card padding="lg" className="mx-auto max-w-lg text-center">
                <CheckCircle2 className="mx-auto size-10 text-success" />
                <p className="mt-3 font-medium text-text">Deposit submitted</p>
                <p className="mt-1 text-sm text-text-muted">Your deposit is being reviewed. We'll credit your wallet once it's approved.</p>
            </Card>
        );
    }

    return (
        <div className="mx-auto max-w-lg">
            <Card padding="lg">
                <CardHeader className="flex-col items-start">
                    <CardTitle>Deposit Funds</CardTitle>
                    <CardDescription>Choose a currency and payment method to top up your wallet.</CardDescription>
                </CardHeader>

                <DepositForm onSuccess={() => setIsSuccess(true)} />
            </Card>
        </div>
    );
}
