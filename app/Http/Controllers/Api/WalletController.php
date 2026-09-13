<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ResolvesTargetUser;
use App\Http\Controllers\Controller;
use App\Models\Wallet;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    use ResolvesTargetUser;

    public function show(Request $request)
    {
        $user = $this->resolveTargetUser($request);
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);

        return response()->json(self::payload($wallet));
    }

    public static function payload(Wallet $wallet): array
    {
        return [
            'availableBalance' => (float) $wallet->available_balance,
            'pendingBalance' => (float) $wallet->pending_balance,
            'totalEarnings' => (float) $wallet->total_earnings,
            'totalDeposits' => (float) $wallet->total_deposits,
            'totalWithdrawals' => (float) $wallet->total_withdrawals,
        ];
    }
}
