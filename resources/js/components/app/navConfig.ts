import {
    LayoutDashboard,
    Package,
    TrendingUp,
    Wallet,
    ArrowDownToLine,
    ArrowUpFromLine,
    Receipt,
    Share2,
    Gift,
    Bot,
    Bell,
    LifeBuoy,
    UserCircle,
    Settings,
} from 'lucide-react';

export interface NavItem {
    to: string;
    label: string;
    icon: typeof LayoutDashboard;
    end?: boolean;
}

export const APP_NAV_ITEMS: NavItem[] = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/app/my-package', label: 'My Package', icon: Package },
    { to: '/app/earnings', label: 'Earnings', icon: TrendingUp },
    { to: '/app/wallet', label: 'Wallet', icon: Wallet },
    { to: '/app/deposit', label: 'Deposit', icon: ArrowDownToLine },
    { to: '/app/withdraw', label: 'Withdraw', icon: ArrowUpFromLine },
    { to: '/app/transactions', label: 'Transactions', icon: Receipt },
    { to: '/app/referral', label: 'Referral', icon: Share2 },
    { to: '/app/bonus-hours', label: 'Bonus Hours', icon: Gift },
    { to: '/app/bot-pass', label: 'Bot Pass', icon: Bot },
    { to: '/app/notifications', label: 'Notifications', icon: Bell },
    { to: '/app/support', label: 'Support', icon: LifeBuoy },
    { to: '/app/profile', label: 'Profile', icon: UserCircle },
    { to: '/app/settings', label: 'Settings', icon: Settings },
];
