<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;

class StatsController extends Controller
{
    public function platform()
    {
        $customers = User::query()->where('role', 'user')->withCount([])->with('currentPackage')->get();
        $activePackages = $customers->filter(fn (User $u) => $u->currentPackage && $u->currentPackage->status === 'active')->count();
        $referralMembers = $customers->filter(fn (User $u) => filled($u->referred_by))->count();
        $totalRewards = Transaction::query()->where('type', 'earning')->where('status', 'completed')->sum('amount');

        return response()->json([
            ['id' => 'active-users', 'label' => 'Active Users', 'value' => number_format($customers->count())],
            ['id' => 'active-packages', 'label' => 'Active Packages', 'value' => number_format($activePackages)],
            ['id' => 'total-rewards', 'label' => 'Total Rewards Paid', 'value' => '$'.number_format((float) $totalRewards)],
            ['id' => 'referral-members', 'label' => 'Referral Members', 'value' => number_format($referralMembers)],
        ]);
    }
}
