import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingState } from '@/components/ui/LoadingState';
import { TransactionTable } from '@/components/app/TransactionTable';
import { userService } from '@/services/userService';
import { walletService } from '@/services/walletService';
import { transactionService } from '@/services/transactionService';
import { referralService } from '@/services/referralService';
import { packageService } from '@/services/packageService';
import type { AdminUserRow } from '@/data/adminUsersSeed';
import type { WalletSummary } from '@/data/walletSeed';
import type { Transaction } from '@/data/transactions';
import type { ReferralEntry, BonusHoursSummary } from '@/data/referralSeed';
import type { CurrentPackage } from '@/data/currentPackage';
import type { PackageHistoryEntry } from '@/data/packageHistorySeed';

export default function UserDetail() {
    const { userId } = useParams();
    const [user, setUser] = useState<AdminUserRow | null>(null);
    const [wallet, setWallet] = useState<WalletSummary | null>(null);
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [referrals, setReferrals] = useState<ReferralEntry[] | null>(null);
    const [bonusHours, setBonusHours] = useState<BonusHoursSummary | null>(null);
    const [pkg, setPkg] = useState<CurrentPackage | null>(null);
    const [history, setHistory] = useState<PackageHistoryEntry[] | null>(null);

    useEffect(() => {
        if (!userId) return;
        userService.getAdminUser(userId).then(setUser);
        walletService.getSummary(userId).then(setWallet);
        transactionService.listAll().then((all) => setTransactions(all.filter((t) => t.userId === userId)));
        referralService.getReferralList(userId).then(setReferrals);
        referralService.getBonusHoursSummary(userId).then(setBonusHours);
        packageService.getCurrentPackage(userId).then(setPkg);
        packageService.getPackageHistory(userId).then(setHistory);
    }, [userId]);

    if (!user) return <LoadingState />;

    return (
        <div className="space-y-4">
            <Link to="/admin/users" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text">
                <ArrowLeft className="size-4" /> Back to Users
            </Link>

            <Card padding="lg">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-text">{user.name}</h2>
                        <p className="text-sm text-text-muted">{user.email}</p>
                    </div>
                    <Badge variant={user.status === 'active' ? 'active' : 'suspended'}>{user.status}</Badge>
                </div>
            </Card>

            <Card padding="lg">
                <Tabs
                    tabs={[
                        {
                            key: 'profile',
                            label: 'Profile',
                            content: (
                                <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                                    <div>
                                        <dt className="text-text-subtle">Mobile</dt>
                                        <dd className="mt-1 font-medium text-text">{user.mobile}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-text-subtle">Registered</dt>
                                        <dd className="mt-1 font-medium text-text">{new Date(user.registeredAt).toLocaleDateString()}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-text-subtle">Referrals</dt>
                                        <dd className="mt-1 font-medium text-text">{user.referrals}</dd>
                                    </div>
                                </dl>
                            ),
                        },
                        {
                            key: 'wallet',
                            label: 'Wallet',
                            content: wallet ? (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    <StatCard label="Available Balance" value={`$${wallet.availableBalance.toFixed(2)}`} />
                                    <StatCard label="Pending Balance" value={`$${wallet.pendingBalance.toFixed(2)}`} />
                                    <StatCard label="Total Earnings" value={`$${wallet.totalEarnings.toFixed(2)}`} />
                                </div>
                            ) : (
                                <LoadingState />
                            ),
                        },
                        {
                            key: 'packages',
                            label: 'Packages',
                            content:
                                pkg && history ? (
                                    <div className="space-y-3 text-sm">
                                        <p className="font-medium text-text">
                                            Current: {pkg.name} (${pkg.amount.toLocaleString()}) — <Badge variant={pkg.status}>{pkg.status}</Badge>
                                        </p>
                                        <p className="text-text-subtle">{history.length} package(s) in history</p>
                                    </div>
                                ) : (
                                    <LoadingState />
                                ),
                        },
                        {
                            key: 'transactions',
                            label: 'Transactions',
                            content: transactions ? <TransactionTable transactions={transactions.slice(0, 10)} /> : <LoadingState />,
                        },
                        {
                            key: 'earnings',
                            label: 'Earnings',
                            content: transactions ? (
                                <TransactionTable transactions={transactions.filter((t) => t.type === 'earning')} />
                            ) : (
                                <LoadingState />
                            ),
                        },
                        {
                            key: 'referrals',
                            label: 'Referrals',
                            content: referrals ? (
                                <ul className="space-y-2 text-sm">
                                    {referrals.map((r) => (
                                        <li key={r.id} className="flex justify-between border-b border-border-subtle py-2 last:border-b-0">
                                            <span>{r.userName}</span>
                                            <Badge variant={r.status === 'active' ? 'active' : 'inactive'}>{r.status}</Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <LoadingState />
                            ),
                        },
                        {
                            key: 'bonus-hours',
                            label: 'Bonus Hours',
                            content: bonusHours ? (
                                <div className="grid grid-cols-3 gap-4">
                                    <StatCard label="Available" value={bonusHours.available.toFixed(1)} />
                                    <StatCard label="Pending" value={bonusHours.pending.toFixed(1)} />
                                    <StatCard label="Total Earned" value={bonusHours.totalEarned.toFixed(1)} />
                                </div>
                            ) : (
                                <LoadingState />
                            ),
                        },
                        {
                            key: 'activity',
                            label: 'Activity Log',
                            content: transactions ? (
                                <ul className="space-y-2 text-sm">
                                    {transactions.slice(0, 8).map((t) => (
                                        <li key={t.id} className="flex justify-between border-b border-border-subtle py-2 last:border-b-0">
                                            <span className="text-text-muted">{t.description}</span>
                                            <span className="text-text-subtle">{new Date(t.date).toLocaleDateString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <LoadingState />
                            ),
                        },
                    ]}
                />
            </Card>
        </div>
    );
}
