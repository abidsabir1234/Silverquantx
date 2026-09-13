<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExchangeRate;
use App\Models\Notification;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class DepositController extends Controller
{
    private const METHODS_BY_CURRENCY = [
        'PKR' => ['Easypaisa', 'JazzCash', 'Bank Transfer'],
        'USD' => ['Crypto', 'USDT'],
    ];

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'min:0.01'],
            'currency' => ['required', 'in:PKR,USD'],
            'method' => ['required', 'string'],
            'reference' => ['required', 'string', 'max:255'],
            'proof' => ['required', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ]);

        if (! in_array($validated['method'], self::METHODS_BY_CURRENCY[$validated['currency']], true)) {
            throw ValidationException::withMessages(['method' => 'Invalid method for the selected currency.']);
        }

        $user = $request->user();
        $rate = ExchangeRate::current();
        $usdAmount = $validated['currency'] === 'PKR'
            ? round($validated['amount'] / (float) $rate->rate, 2)
            : round($validated['amount'], 2);

        $transaction = DB::transaction(function () use ($request, $user, $validated, $usdAmount) {
            $wallet = Wallet::query()->lockForUpdate()->firstOrCreate(['user_id' => $user->id]);
            $proofPath = $request->file('proof')->store('deposit-proofs', 'local');

            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'deposit',
                'description' => "Deposit via {$validated['method']}",
                'amount' => $usdAmount,
                'balance_after' => $wallet->available_balance,
                'status' => 'pending',
                'reference' => $validated['reference'],
                'method' => $validated['method'],
                'proof_path' => $proofPath,
            ]);

            $wallet->increment('total_deposits', $usdAmount);

            Notification::pushAdmin('New deposit pending', "A new deposit of \${$usdAmount} is awaiting approval.");

            return $transaction;
        });

        return response()->json(TransactionController::payload($transaction));
    }

    // --- Admin-scoped ---

    public function index()
    {
        $deposits = Transaction::query()->where('type', 'deposit')->latest()->get();

        return response()->json($deposits->map(fn (Transaction $t) => TransactionController::adminPayload($t))->values());
    }

    public function approve(Transaction $transaction)
    {
        if ($transaction->type !== 'deposit') {
            abort(404);
        }

        DB::transaction(function () use ($transaction) {
            $wallet = Wallet::query()->lockForUpdate()->firstOrCreate(['user_id' => $transaction->user_id]);
            $wallet->increment('available_balance', $transaction->amount);

            $transaction->update([
                'status' => 'completed',
                'balance_after' => $wallet->fresh()->available_balance,
            ]);

            Notification::pushUser($transaction->user_id, 'Deposit approved', "Your deposit of \${$transaction->amount} has been credited to your wallet.");
        });

        return response()->json(TransactionController::payload($transaction->fresh()));
    }

    public function reject(Transaction $transaction)
    {
        if ($transaction->type !== 'deposit') {
            abort(404);
        }

        $transaction->update(['status' => 'rejected']);
        Notification::pushUser($transaction->user_id, 'Deposit rejected', "Your deposit of \${$transaction->amount} was rejected.");

        return response()->json(TransactionController::payload($transaction));
    }
}
