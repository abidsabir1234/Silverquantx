import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';
import { walletService } from '@/services/walletService';
import { withdrawService, METHOD_FEES } from '@/services/withdrawService';
import type { WithdrawMethod } from '@/services/withdrawService';
import { WithdrawMethodFields, formatAccountDetails } from '@/components/app/WithdrawMethodFields';
import type { WalletSummary } from '@/data/walletSeed';

const METHODS: WithdrawMethod[] = ['Bank Transfer', 'Easypaisa', 'JazzCash', 'Crypto', 'USDT'];

export default function Withdraw() {
    const [wallet, setWallet] = useState<WalletSummary | null>(null);
    const [method, setMethod] = useState<WithdrawMethod>('Bank Transfer');
    const [amount, setAmount] = useState('');
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        walletService.getSummary().then(setWallet);
    }, []);

    const numericAmount = Number(amount) || 0;
    const fee = METHOD_FEES[method];
    const feeAmount = Math.round(numericAmount * (fee.feePercent / 100) * 100) / 100;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        if (!wallet || numericAmount > wallet.availableBalance) {
            setError('Withdrawal amount exceeds your available balance.');
            return;
        }
        setIsConfirmOpen(true);
    }

    async function handleConfirm() {
        setIsSubmitting(true);
        setError(null);
        try {
            await withdrawService.submitWithdrawal({
                amount: numericAmount,
                method,
                accountDetails: formatAccountDetails(method, fieldValues),
            });
            setIsSuccess(true);
            setIsConfirmOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSuccess) {
        return (
            <Card padding="lg" className="mx-auto max-w-lg text-center">
                <CheckCircle2 className="mx-auto size-10 text-success" />
                <p className="mt-3 font-medium text-text">Withdrawal requested</p>
                <p className="mt-1 text-sm text-text-muted">
                    Your withdrawal is being processed. Estimated time: {fee.processingTime}.
                </p>
            </Card>
        );
    }

    return (
        <div className="mx-auto max-w-lg">
            <Card padding="lg">
                <CardHeader className="flex-col items-start">
                    <CardTitle>Withdraw Funds</CardTitle>
                    <CardDescription>
                        Available balance: <span className="font-medium text-text">${wallet ? wallet.availableBalance.toFixed(2) : '—'}</span>
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <p className="mb-1.5 text-sm font-medium text-text">Method</p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {METHODS.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMethod(m)}
                                    className={cn(
                                        'rounded-control border px-3 py-2.5 text-sm font-medium transition-colors',
                                        method === m
                                            ? 'border-silver bg-surface-alt text-text'
                                            : 'border-border text-text-muted hover:text-text'
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Withdrawal Amount (USD)"
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <WithdrawMethodFields method={method} values={fieldValues} onChange={(key, value) => setFieldValues((v) => ({ ...v, [key]: value }))} />

                    <div className="space-y-1.5 rounded-control border border-border-subtle bg-surface-alt p-3.5 text-sm">
                        <div className="flex items-center justify-between text-text-muted">
                            <span className="flex items-center gap-1.5">
                                <Clock className="size-3.5" /> Estimated processing time
                            </span>
                            <span className="text-text">{fee.processingTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-text-muted">
                            <span>Fee ({fee.feePercent}%)</span>
                            <span className="text-text">${feeAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {error && <p className="text-sm text-danger">{error}</p>}

                    <Button type="submit" fullWidth>
                        Continue
                    </Button>
                </form>
            </Card>

            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Confirm Withdrawal"
                description={`Withdraw $${numericAmount.toFixed(2)} via ${method}?`}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsConfirmOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} isLoading={isSubmitting}>
                            Confirm Withdrawal
                        </Button>
                    </>
                }
            />
        </div>
    );
}
