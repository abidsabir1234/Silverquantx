import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import { Users, UserCheck, ArrowDownToLine, ArrowUpFromLine, Package, TrendingUp, Clock, AlertTriangle, Landmark } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { ChartCard } from '@/components/ui/ChartCard';
import { adminService } from '@/services/adminService';
import type { AdminSummary, ChartPoint } from '@/data/adminStats';

const AXIS_PROPS = { stroke: '#9ca3af', fontSize: 12, tickLine: false, axisLine: false };
const TOOLTIP_STYLE = { contentStyle: { background: '#111715', border: '1px solid #1e2622', borderRadius: 8, fontSize: 12 }, labelStyle: { color: '#f3f4f6' } };
const GRID_PROPS = { strokeDasharray: '3 3', stroke: '#1e2622', vertical: false };

export default function Dashboard() {
    const [summary, setSummary] = useState<AdminSummary | null>(null);
    const [charts, setCharts] = useState<Record<string, ChartPoint[]> | null>(null);

    useEffect(() => {
        adminService.getDashboardSummary().then(setSummary);
        adminService.getCharts().then(setCharts);
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Users" value={summary ? summary.totalUsers.toLocaleString() : '—'} icon={<Users className="size-4" />} />
                <StatCard label="Active Users" value={summary ? summary.activeUsers.toLocaleString() : '—'} icon={<UserCheck className="size-4" />} />
                <StatCard label="Total Deposits" value={summary ? `$${summary.totalDeposits.toLocaleString()}` : '—'} icon={<ArrowDownToLine className="size-4" />} />
                <StatCard label="Total Withdrawals" value={summary ? `$${summary.totalWithdrawals.toLocaleString()}` : '—'} icon={<ArrowUpFromLine className="size-4" />} />
                <StatCard label="Active Packages" value={summary ? summary.activePackages.toLocaleString() : '—'} icon={<Package className="size-4" />} />
                <StatCard label="Total Earnings" value={summary ? `$${summary.totalEarnings.toLocaleString()}` : '—'} icon={<TrendingUp className="size-4" />} />
                <StatCard label="Pending Deposits" value={summary ? String(summary.pendingDeposits) : '—'} icon={<Clock className="size-4" />} />
                <StatCard label="Pending Withdrawals" value={summary ? String(summary.pendingWithdrawals) : '—'} icon={<AlertTriangle className="size-4" />} />
                <StatCard
                    label="Net Platform Revenue"
                    value={summary ? `$${summary.netPlatformRevenue.toLocaleString()}` : '—'}
                    icon={<Landmark className="size-4" />}
                />
            </div>
            <p className="-mt-2 text-xs text-text-subtle">Net Platform Revenue = total package sales minus total earnings paid out.</p>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard title="User Growth" isLoading={!charts}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={charts?.userGrowth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                            <CartesianGrid {...GRID_PROPS} />
                            <XAxis dataKey="label" {...AXIS_PROPS} />
                            <YAxis {...AXIS_PROPS} />
                            <Tooltip {...TOOLTIP_STYLE} />
                            <Line type="monotone" dataKey="value" stroke="#c7cdd6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Deposits" isLoading={!charts}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={charts?.deposits} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="depositsFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00C985" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#00C985" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_PROPS} />
                            <XAxis dataKey="label" {...AXIS_PROPS} />
                            <YAxis {...AXIS_PROPS} />
                            <Tooltip {...TOOLTIP_STYLE} />
                            <Area type="monotone" dataKey="value" stroke="#00C985" fill="url(#depositsFill)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Withdrawals" isLoading={!charts}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={charts?.withdrawals} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                            <defs>
                                <linearGradient id="withdrawalsFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_PROPS} />
                            <XAxis dataKey="label" {...AXIS_PROPS} />
                            <YAxis {...AXIS_PROPS} />
                            <Tooltip {...TOOLTIP_STYLE} />
                            <Area type="monotone" dataKey="value" stroke="#ef4444" fill="url(#withdrawalsFill)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Earnings" isLoading={!charts}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts?.earnings} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                            <CartesianGrid {...GRID_PROPS} />
                            <XAxis dataKey="label" {...AXIS_PROPS} />
                            <YAxis {...AXIS_PROPS} />
                            <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: '#161e1b' }} />
                            <Bar dataKey="value" fill="#00C985" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Referral Activity" isLoading={!charts}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={charts?.referralActivity} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                            <CartesianGrid {...GRID_PROPS} />
                            <XAxis dataKey="label" {...AXIS_PROPS} />
                            <YAxis {...AXIS_PROPS} />
                            <Tooltip {...TOOLTIP_STYLE} cursor={{ fill: '#161e1b' }} />
                            <Bar dataKey="value" fill="#c7cdd6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </div>
    );
}
