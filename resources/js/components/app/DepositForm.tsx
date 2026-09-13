import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Upload, Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';
import { settingsService } from '@/services/settingsService';
import { depositService } from '@/services/depositService';
import { packageService } from '@/services/packageService';
import type { DepositCurrency, DepositMethod } from '@/services/depositService';
import type { Transaction } from '@/data/transactions';
import type { PackagePlan } from '@/data/packages';

const METHODS_BY_CURRENCY: Record<DepositCurrency, DepositMethod[]> = {
    PKR: ['Easypaisa', 'JazzCash', 'Bank Transfer'],
    USD: ['Crypto', 'USDT'],
};

export function DepositForm({ onSuccess, submitLabel = 'Continue' }: { onSuccess: (transaction: Transaction) => void; submitLabel?: string }) {
    const [rate, setRate] = useState<number | null>(null);
    const [packages, setPackages] = useState<PackagePlan[]>([]);
    const [currency, setCurrency] = useState<DepositCurrency>('PKR');
    const [method, setMethod] = useState<DepositMethod>('Easypaisa');
    const [amount, setAmount] = useState('');
    const [reference, setReference] = useState('');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        settingsService.getExchangeRate().then((r) => setRate(r.rate));
        packageService.getPackages().then((plans) => setPackages(plans.filter((p) => p.status === 'active')));
    }, []);

    function handleCurrencyChange(next: DepositCurrency) {
        setCurrency(next);
        setMethod(METHODS_BY_CURRENCY[next][0]);
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        setProofFile(event.target.files?.[0] ?? null);
    }

    const numericAmount = Number(amount) || 0;
    const usdAmount = currency === 'PKR' && rate ? numericAmount / rate : numericAmount;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsConfirmOpen(true);
    }

    async function handleConfirm() {
        if (!proofFile) {
            setError('Please attach your payment proof.');
            return;
        }
        setIsSubmitting(true);
        setError(null);
        try {
            const transaction = await depositService.submitDeposit({ amount: numericAmount, currency, method, reference, proofFile });
            setIsConfirmOpen(false);
            onSuccess(transaction);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    function formatForCurrency(usdAmount: number): string {
        if (currency === 'PKR' && rate) return `Rs ${Math.round(usdAmount * rate).toLocaleString()}`;
        return `$${usdAmount}`;
    }

    return (
        <>
            {packages.length > 0 && (
                <div className="mb-4 rounded-control border border-border-subtle bg-surface-alt p-4">
                    <p className="flex items-center gap-1.5 text-sm font-medium text-text">
                        <Info className="size-4 text-accent" /> Not sure how much to deposit?
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                        Deposit at least a package's price to activate it once your funds are approved.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {packages.map((plan) => (
                            <span
                                key={plan.id}
                                className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted"
                            >
                                {plan.name}: {formatForCurrency(plan.amount)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <p className="mb-1.5 text-sm font-medium text-text">Currency</p>
                    <div className="flex gap-2">
                        {(['PKR', 'USD'] as DepositCurrency[]).map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => handleCurrencyChange(c)}
                                className={cn(
                                    'flex-1 rounded-control border px-4 py-2.5 text-sm font-medium transition-colors',
                                    currency === c
                                        ? 'border-silver bg-surface-alt text-text'
                                        : 'border-border text-text-muted hover:text-text'
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="mb-1.5 text-sm font-medium text-text">Payment Method</p>
                    <div className="grid grid-cols-2 gap-2">
                        {METHODS_BY_CURRENCY[currency].map((m) => (
                            <button
                                key={m}
                                type="button"
                                onClick={() => setMethod(m)}
                                className={cn(
                                    'rounded-control border px-4 py-2.5 text-sm font-medium transition-colors',
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
                    label={`Amount (${currency})`}
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                {rate && numericAmount > 0 && (
                    <p className="text-sm text-text-muted">
                        You will receive approximately <span className="font-medium text-text">${usdAmount.toFixed(2)} USD</span>
                    </p>
                )}

                <Input
                    label="Transaction Reference"
                    placeholder="Transaction ID from your payment app"
                    required
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                />

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-text">Payment Proof</label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-control border border-dashed border-border bg-surface-alt px-3.5 py-3 text-sm text-text-subtle hover:border-silver/40">
                        <Upload className="size-4" />
                        {proofFile?.name || 'Upload screenshot or receipt'}
                        <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} required />
                    </label>
                </div>

                {error && <p className="text-sm text-danger">{error}</p>}

                <Button type="submit" fullWidth>
                    {submitLabel}
                </Button>
            </form>

            <Modal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="Confirm Deposit"
                description={`Submit a ${currency} ${numericAmount.toLocaleString()} deposit via ${method}?`}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsConfirmOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} isLoading={isSubmitting}>
                            Submit Deposit
                        </Button>
                    </>
                }
            />
        </>
    );
}
