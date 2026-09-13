import { useEffect, useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { Pagination } from '@/components/ui/Pagination';
import { TransactionTable } from '@/components/app/TransactionTable';
import { cn } from '@/utils/cn';
import { transactionService } from '@/services/transactionService';
import type { Transaction, TransactionType } from '@/data/transactions';

const FILTERS: { value: TransactionType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'deposit', label: 'Deposit' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'earning', label: 'Earning' },
    { value: 'referral', label: 'Referral' },
    { value: 'bonus', label: 'Bonus' },
    { value: 'package', label: 'Package' },
];

const PAGE_SIZE = 10;

function exportCsv(transactions: Transaction[]) {
    const header = 'Date,Type,Description,Amount,Balance,Status,Reference';
    const rows = transactions.map((t) =>
        [new Date(t.date).toISOString(), t.type, `"${t.description}"`, t.amount, t.balanceAfter, t.status, t.reference].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [filter, setFilter] = useState<TransactionType | 'all'>('all');
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        transactionService.list().then(setTransactions);
    }, []);

    const filtered = useMemo(() => {
        if (!transactions) return [];
        return transactions.filter((t) => {
            if (filter !== 'all' && t.type !== filter) return false;
            if (search && !`${t.description} ${t.reference}`.toLowerCase().includes(search.toLowerCase())) return false;
            if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false;
            if (dateTo && new Date(t.date) > new Date(`${dateTo}T23:59:59`)) return false;
            return true;
        });
    }, [transactions, filter, search, dateFrom, dateTo]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => {
                            setFilter(f.value);
                            setPage(1);
                        }}
                        className={cn(
                            'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                            filter === f.value ? 'bg-silver text-[#080B0A]' : 'bg-surface text-text-muted hover:text-text'
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Input
                    leftIcon={<Search className="size-4" />}
                    placeholder="Search description or reference"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="max-w-xs"
                />
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-auto" />
                <span className="text-text-subtle">to</span>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-auto" />
                <Button
                    variant="secondary"
                    leftIcon={<Download className="size-4" />}
                    onClick={() => exportCsv(filtered)}
                    className="ml-auto"
                >
                    Export
                </Button>
            </div>

            <Card padding="none">
                {transactions ? (
                    <>
                        <TransactionTable transactions={pageItems} />
                        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                    </>
                ) : (
                    <LoadingState />
                )}
            </Card>
        </div>
    );
}
