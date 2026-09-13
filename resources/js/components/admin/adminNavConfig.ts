import {
    LayoutGrid,
    Users,
    Package,
    Coins,
    Banknote,
    ArrowLeftRight,
    TrendingUp,
    Network,
    Hourglass,
    Cpu,
    Wallet,
    Percent,
    BarChart3,
    Bell,
    Sliders,
    ShieldAlert,
} from 'lucide-react';

export interface AdminNavItem {
    to: string;
    label: string;
    description?: string;
    icon: typeof LayoutGrid;
    end?: boolean;
}

export interface AdminNavGroup {
    groupTitle: string;
    items: AdminNavItem[];
}

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
    {
        groupTitle: 'Core',
        items: [
            { to: '/admin', label: 'Dashboard', description: 'Platform-wide activity at a glance.', icon: LayoutGrid, end: true },
            { to: '/admin/users', label: 'Users', description: 'Every registered customer and their account status.', icon: Users },
            { to: '/admin/admins', label: 'Admins', description: 'Manage who has administrative access to this panel.', icon: ShieldAlert },
        ],
    },
    {
        groupTitle: 'Finance',
        items: [
            { to: '/admin/deposits', label: 'Deposits', description: 'Review and approve or reject incoming deposit requests.', icon: Coins },
            { to: '/admin/withdrawals', label: 'Withdrawals', description: 'Process pending withdrawal requests.', icon: Banknote },
            { to: '/admin/transactions', label: 'Transactions', description: 'The full ledger across every account.', icon: ArrowLeftRight },
            { to: '/admin/earnings', label: 'Earnings', description: 'Earning cycle payouts across all users.', icon: TrendingUp },
            { to: '/admin/payment-methods', label: 'Payment Methods', description: 'Configure available deposit and withdrawal channels.', icon: Wallet },
            { to: '/admin/exchange-rate', label: 'Exchange Rate', description: 'Set the PKR/USD conversion rate used at deposit.', icon: Percent },
        ],
    },
    {
        groupTitle: 'Operations',
        items: [
            { to: '/admin/packages', label: 'Packages', description: 'Create and manage the packages users can activate.', icon: Package },
            { to: '/admin/referrals', label: 'Referrals', description: 'Track referral relationships and bonus eligibility.', icon: Network },
            { to: '/admin/bonus-hours', label: 'Bonus Hours', description: 'Review and adjust bonus hour balances.', icon: Hourglass },
            { to: '/admin/bot-passes', label: 'Bot Passes', description: 'Manage bot pass plans and active subscriptions.', icon: Cpu },
        ],
    },
    {
        groupTitle: 'System',
        items: [
            { to: '/admin/reports', label: 'Reports', description: 'Platform-wide summaries and exportable reports.', icon: BarChart3 },
            { to: '/admin/notifications', label: 'Notifications', description: 'System-wide alerts sent to the admin team.', icon: Bell },
            { to: '/admin/settings', label: 'Settings', description: 'Platform configuration and general preferences.', icon: Sliders },
        ],
    },
];

export const ADMIN_NAV_ITEMS: AdminNavItem[] = ADMIN_NAV_GROUPS.flatMap((group) => group.items);
