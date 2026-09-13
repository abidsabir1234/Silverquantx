<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class WithdrawController extends Controller
{
    private const METHODS = ['Bank Transfer', 'Easypaisa', 'JazzCash', 'Crypto', 'USDT'];

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'in:'.implode(',', self::METHODS)],
            'accountDetails' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();

        $transaction = DB::transaction(function () use ($user, $validated) {
            $wallet = Wallet::query()->lockForUpdate()->firstOrCreate(['user_id' => $user->id]);

            if ((float) $validated['amount'] > (float) $wallet->available_balance) {
                throw ValidationException::withMessages(['amount' => 'Withdrawal amount exceeds your available balance.']);
            }

            $wallet->decrement('available_balance', $validated['amount']);
            $wallet->increment('pending_balance', $validated['amount']);

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'withdrawal',
                'description' => "Withdrawal to {$validated['method']}",
                'amount' => -$validated['amount'],
                'balance_after' => $wallet->fresh()->available_balance,
                'status' => 'pending',
                'reference' => 'WD'.now()->valueOf(),
                'method' => $validated['method'],
                'account_details' => $validated['accountDetails'],
            ]);

            Notification::pushAdmin('New withdrawal pending', "A new withdrawal request of \${$validated['amount']} is awaiting approval.");

            return $transaction;
        });

        return response()->json(TransactionController::payload($transaction));
    }

    // --- Admin-scoped ---

    public function index()
    {
        $withdrawals = Transaction::query()->where('type', 'withdrawal')->latest()->get();

        return response()->json($withdrawals->map(fn (Transaction $t) => TransactionController::adminPayload($t))->values());
    }

    public function approve(Transaction $transaction)
    {
        $this->guardWithdrawal($transaction);

        $transaction->update(['status' => 'processing']);

        return response()->json(TransactionController::payload($transaction));
    }

    public function process(Transaction $transaction)
    {
        $this->guardWithdrawal($transaction);

        DB::transaction(function () use ($transaction) {
            $amount = abs((float) $transaction->amount);
            $wallet = Wallet::query()->lockForUpdate()->firstOrCreate(['user_id' => $transaction->user_id]);
            $wallet->decrement('pending_balance', $amount);
            $wallet->increment('total_withdrawals', $amount);

            $transaction->update([
                'status' => 'completed',
                'balance_after' => $wallet->fresh()->available_balance,
            ]);

            Notification::pushUser($transaction->user_id, 'Withdrawal processed', "Your withdrawal of \${$amount} has been sent.");
        });

        return response()->json(TransactionController::payload($transaction->fresh()));
    }

    public function reject(Transaction $transaction)
    {
        $this->guardWithdrawal($transaction);

        DB::transaction(function () use ($transaction) {
            $amount = abs((float) $transaction->amount);
            $wallet = Wallet::query()->lockForUpdate()->firstOrCreate(['user_id' => $transaction->user_id]);
            $wallet->decrement('pending_balance', $amount);
            $wallet->increment('available_balance', $amount);

            $transaction->update([
                'status' => 'rejected',
                'balance_after' => $wallet->fresh()->available_balance,
            ]);

            Notification::pushUser($transaction->user_id, 'Withdrawal rejected', "Your withdrawal of \${$amount} was rejected and refunded to your balance.");
        });

        return response()->json(TransactionController::payload($transaction->fresh()));
    }

    private function guardWithdrawal(Transaction $transaction): void
    {
        if ($transaction->type !== 'withdrawal') {
            abort(404);
        }
    }
}
