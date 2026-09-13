import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { buttonVariants } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { TransactionTable } from '@/components/app/TransactionTable';
import { walletService } from '@/services/walletService';
import { transactionService } from '@/services/transactionService';
import type { WalletSummary } from '@/data/walletSeed';
import type { Transaction } from '@/data/transactions';

export default function Wallet() {
    const [wallet, setWallet] = useState<WalletSummary | null>(null);
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);

    useEffect(() => {
        walletService.getSummary().then(setWallet);
        transactionService.list().then(setTransactions);
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard label="Available Balance" value={wallet ? `$${wallet.availableBalance.toFixed(2)}` : '—'} />
                <StatCard label="Pending Balance" value={wallet ? `$${wallet.pendingBalance.toFixed(2)}` : '—'} />
                <StatCard label="Total Earnings" value={wallet ? `$${wallet.totalEarnings.toFixed(2)}` : '—'} />
                <StatCard label="Total Deposits" value={wallet ? `$${wallet.totalDeposits.toFixed(2)}` : '—'} />
                <StatCard label="Total Withdrawals" value={wallet ? `$${wallet.totalWithdrawals.toFixed(2)}` : '—'} />
            </div>

            <div className="flex gap-3">
                <Link to="/app/deposit" className={buttonVariants()}>
                    <ArrowDownToLine className="size-4" />
                    Deposit
                </Link>
                <Link to="/app/withdraw" className={buttonVariants({ variant: 'outline' })}>
                    <ArrowUpFromLine className="size-4" />
                    Withdraw
                </Link>
            </div>

            <Card padding="none">
                <div className="p-5">
                    <CardHeader className="mb-0">
                        <CardTitle>Recent Transactions</CardTitle>
                        <Link to="/app/transactions" className="text-sm text-text-muted hover:text-text">
                            View All
                        </Link>
                    </CardHeader>
                </div>
                {transactions ? <TransactionTable transactions={transactions.slice(0, 8)} /> : <LoadingState />}
            </Card>
        </div>
    );
}
