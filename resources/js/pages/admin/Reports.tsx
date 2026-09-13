import { useEffect, useState } from 'react';
import { Download, Users, ArrowDownToLine, ArrowUpFromLine, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell } from '@/components/ui/Table';
import { LoadingState } from '@/components/ui/LoadingState';
import { adminService } from '@/services/adminService';
import type { AdminSummary, ChartPoint } from '@/data/adminStats';

function exportReportCsv(rows: { month: string; users: number; deposits: number; withdrawals: number; earnings: number; referrals: number }[]) {
    const header = 'Month,User Growth,Deposits,Withdrawals,Earnings,Referral Activity';
    const csvRows = rows.map((r) => [r.month, r.users, r.deposits, r.withdrawals, r.earnings, r.referrals].join(','));
    const csv = [header, ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'platform-report.csv';
    link.click();
    URL.revokeObjectURL(url);
}

export default function Reports() {
    const [summary, setSummary] = useState<AdminSummary | null>(null);
    const [charts, setCharts] = useState<Record<string, ChartPoint[]> | null>(null);

    useEffect(() => {
        adminService.getDashboardSummary().then(setSummary);
        adminService.getCharts().then(setCharts);
    }, []);

    const rows =
        charts?.userGrowth.map((point, i) => ({
            month: point.label,
            users: point.value,
            deposits: charts.deposits[i]?.value ?? 0,
            withdrawals: charts.withdrawals[i]?.value ?? 0,
            earnings: charts.earnings[i]?.value ?? 0,
            referrals: charts.referralActivity[i]?.value ?? 0,
        })) ?? [];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total Users" value={summary ? summary.totalUsers.toLocaleString() : '—'} icon={<Users className="size-4" />} />
                <StatCard
                    label="Total Deposits"
                    value={summary ? `$${summary.totalDeposits.toLocaleString()}` : '—'}
                    icon={<ArrowDownToLine className="size-4" />}
                />
                <StatCard
                    label="Total Withdrawals"
                    value={summary ? `$${summary.totalWithdrawals.toLocaleString()}` : '—'}
                    icon={<ArrowUpFromLine className="size-4" />}
                />
                <StatCard
                    label="Total Earnings"
                    value={summary ? `$${summary.totalEarnings.toLocaleString()}` : '—'}
                    icon={<TrendingUp className="size-4" />}
                />
            </div>

            <Card padding="none">
                <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
                    <CardHeader className="mb-0">
                        <CardTitle>Monthly Breakdown</CardTitle>
                    </CardHeader>
                    <Button variant="secondary" size="sm" leftIcon={<Download className="size-4" />} onClick={() => exportReportCsv(rows)}>
                        Export CSV
                    </Button>
                </div>
                {!charts ? (
                    <LoadingState />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell>Month</TableHeadCell>
                                <TableHeadCell>User Growth</TableHeadCell>
                                <TableHeadCell>Deposits</TableHeadCell>
                                <TableHeadCell>Withdrawals</TableHeadCell>
                                <TableHeadCell>Earnings</TableHeadCell>
                                <TableHeadCell>Referral Activity</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((r) => (
                                <TableRow key={r.month}>
                                    <TableCell className="font-medium">{r.month}</TableCell>
                                    <TableCell>{r.users.toLocaleString()}</TableCell>
                                    <TableCell>${r.deposits.toLocaleString()}</TableCell>
                                    <TableCell>${r.withdrawals.toLocaleString()}</TableCell>
                                    <TableCell>${r.earnings.toLocaleString()}</TableCell>
                                    <TableCell>{r.referrals}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    );
}
