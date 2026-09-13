import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { LoadingState } from '@/components/ui/LoadingState';
import { TransactionTable } from '@/components/app/TransactionTable';
import { walletService } from '@/services/walletService';
import { transactionService } from '@/services/transactionService';
import type { WalletSummary } from '@/data/walletSeed';
import type { Transaction } from '@/data/transactions';

export default function Earnings() {
    const [wallet, setWallet] = useState<WalletSummary | null>(null);
    const [earnings, setEarnings] = useState<Transaction[] | null>(null);

    useEffect(() => {
        walletService.getSummary().then(setWallet);
        transactionService.list().then((all) => setEarnings(all.filter((t) => t.type === 'earning')));
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StatCard
                    label="Total Earnings"
                    value={wallet ? `$${wallet.totalEarnings.toFixed(2)}` : '—'}
                    icon={<TrendingUp className="size-4" />}
                />
                <StatCard label="Earning Entries" value={earnings ? String(earnings.length) : '—'} />
            </div>

            <Card padding="none">
                <div className="p-5">
                    <CardHeader className="mb-0">
                        <CardTitle>Earning History</CardTitle>
                    </CardHeader>
                </div>
                {earnings ? <TransactionTable transactions={earnings} /> : <LoadingState />}
            </Card>
        </div>
    );
}
