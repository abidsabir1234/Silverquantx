import { useEffect, useState } from 'react';
import { DollarSign, History, User, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingState } from '@/components/ui/LoadingState';
import { settingsService } from '@/services/settingsService';
import type { ExchangeRate as ExchangeRateType } from '@/data/exchangeRateSeed';

export default function ExchangeRate() {
    const [rate, setRate] = useState<ExchangeRateType | null>(null);
    const [newRate, setNewRate] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    function refresh() {
        settingsService.getExchangeRate().then((r) => {
            setRate(r);
            setNewRate(String(r.rate));
        });
    }

    useEffect(refresh, []);

    async function handleConfirmUpdate() {
        await settingsService.updateExchangeRate(Number(newRate), 'Platform Admin');
        refresh();
    }

    if (!rate) return <LoadingState />;

    const hasChanged = Number(newRate) !== rate.rate && newRate !== '';

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Current Rate" value={`1 USD = ${rate.rate} PKR`} icon={<DollarSign className="size-5" />} />
                <StatCard label="Previous Rate" value={`1 USD = ${rate.previousRate} PKR`} icon={<History className="size-5" />} />
                <StatCard
                    label="Last Updated"
                    value={new Date(rate.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    icon={<Clock className="size-5" />}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Update Exchange Rate</CardTitle>
                </CardHeader>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                    <User className="size-4" />
                    Last updated by <span className="font-medium text-text">{rate.updatedBy}</span>
                </div>
                <div className="mt-4 flex flex-wrap items-end gap-3">
                    <Input
                        label="1 USD = ? PKR"
                        type="number"
                        value={newRate}
                        onChange={(e) => setNewRate(e.target.value)}
                        className="max-w-xs"
                    />
                    <Button disabled={!hasChanged} onClick={() => setIsConfirmOpen(true)}>
                        Update Rate
                    </Button>
                </div>
            </Card>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmUpdate}
                title="Confirm Exchange Rate Change"
                description={`This will change the platform rate from 1 USD = ${rate.rate} PKR to 1 USD = ${newRate} PKR, affecting all future deposit conversions.`}
                confirmLabel="Confirm Update"
            />
        </div>
    );
}
