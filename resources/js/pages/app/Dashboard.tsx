import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, Package, Gift } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { EarningCycleCard } from '@/components/app/EarningCycleCard';
import { walletService } from '@/services/walletService';
import { packageService } from '@/services/packageService';
import { referralService } from '@/services/referralService';
import type { WalletSummary } from '@/data/walletSeed';
import type { CurrentPackage } from '@/data/currentPackage';
import type { BonusHoursSummary } from '@/data/referralSeed';

export default function Dashboard() {
    const [wallet, setWallet] = useState<WalletSummary | null>(null);
    const [pkg, setPkg] = useState<CurrentPackage | null>(null);
    const [bonusHours, setBonusHours] = useState<BonusHoursSummary | null>(null);

    useEffect(() => {
        walletService.getSummary().then(setWallet);
        packageService.getCurrentPackage().then(setPkg);
        referralService.getBonusHoursSummary().then(setBonusHours);
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Available Balance"
                    value={wallet ? `$${wallet.availableBalance.toFixed(2)}` : '—'}
                    icon={<Wallet className="size-4" />}
                />
                <StatCard
                    label="Total Earnings"
                    value={wallet ? `$${wallet.totalEarnings.toFixed(2)}` : '—'}
                    icon={<TrendingUp className="size-4" />}
                    trend={{ direction: 'up', label: 'active' }}
                />
                <StatCard
                    label="Active Package"
                    value={pkg ? `$${pkg.amount.toLocaleString()}` : '—'}
                    icon={<Package className="size-4" />}
                />
                <StatCard
                    label="Bonus Hours"
                    value={bonusHours ? `${bonusHours.available.toFixed(1)} Hours` : '—'}
                    icon={<Gift className="size-4" />}
                />
            </div>

            <EarningCycleCard />
        </div>
    );
}
