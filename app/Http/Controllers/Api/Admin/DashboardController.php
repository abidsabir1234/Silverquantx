<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function summary()
    {
        $customers = User::query()->where('role', 'user')->with('currentPackage')->get();
        $activeCustomers = $customers->filter(fn (User $u) => $u->currentPackage && $u->currentPackage->status === 'active');

        $sum = fn (string $type, ?string $status = null) => (float) Transaction::query()
            ->where('type', $type)
            ->when($status, fn ($q) => $q->where('status', $status))
            ->get()
            ->sum(fn (Transaction $t) => abs((float) $t->amount));

        $totalDeposits = $sum('deposit', 'completed');
        $totalWithdrawals = $sum('withdrawal', 'completed');
        $totalEarnings = $sum('earning', 'completed');
        $totalPackageSales = $sum('package', 'completed');

        return response()->json([
            'totalUsers' => $customers->count(),
            'activeUsers' => $activeCustomers->count(),
            'totalDeposits' => $totalDeposits,
            'totalWithdrawals' => $totalWithdrawals,
            'activePackages' => $activeCustomers->count(),
            'totalEarnings' => $totalEarnings,
            'pendingDeposits' => Transaction::query()->where('type', 'deposit')->where('status', 'pending')->count(),
            'pendingWithdrawals' => Transaction::query()->where('type', 'withdrawal')->where('status', 'pending')->count(),
            'netPlatformRevenue' => round($totalPackageSales - $totalEarnings, 2),
        ]);
    }

    public function charts()
    {
        $customers = User::query()->where('role', 'user')->orderBy('created_at')->get();
        $transactions = Transaction::query()->get();
        $completed = fn (string $type) => $transactions->filter(fn (Transaction $t) => $t->type === $type && $t->status === 'completed');

        $runningTotal = 0;
        $userGrowth = $this->groupByMonth($customers, fn (User $u) => $u->created_at, function ($bucket) use (&$runningTotal) {
            $runningTotal += count($bucket);

            return $runningTotal;
        });

        return response()->json([
            'userGrowth' => $userGrowth,
            'deposits' => $this->groupByMonth($completed('deposit'), fn (Transaction $t) => $t->created_at, fn ($b) => array_sum(array_map(fn (Transaction $t) => abs((float) $t->amount), $b))),
            'withdrawals' => $this->groupByMonth($completed('withdrawal'), fn (Transaction $t) => $t->created_at, fn ($b) => array_sum(array_map(fn (Transaction $t) => abs((float) $t->amount), $b))),
            'earnings' => $this->groupByMonth($completed('earning'), fn (Transaction $t) => $t->created_at, fn ($b) => array_sum(array_map(fn (Transaction $t) => abs((float) $t->amount), $b))),
            'referralActivity' => $this->groupByMonth($customers->filter(fn (User $u) => filled($u->referred_by)), fn (User $u) => $u->created_at, fn ($b) => count($b)),
        ]);
    }

    /** Groups dated records by calendar month (chronological) and reduces each bucket to a single number. */
    private function groupByMonth(iterable $records, callable $getDate, callable $reduce): array
    {
        $buckets = [];
        foreach ($records as $record) {
            /** @var Carbon $date */
            $date = $getDate($record);
            $key = $date->format('Y-m');
            $buckets[$key][] = $record;
        }

        ksort($buckets);

        $result = [];
        foreach ($buckets as $key => $bucket) {
            $label = Carbon::createFromFormat('Y-m', $key)->format('M y');
            $result[] = ['label' => $label, 'value' => $reduce($bucket)];
        }

        return $result;
    }
}
