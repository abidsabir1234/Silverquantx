<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = Transaction::query()->where('user_id', $request->user()->id)->latest()->get();

        return response()->json($transactions->map(fn (Transaction $t) => self::payload($t))->values());
    }

    // --- Admin-scoped ---

    public function adminIndex()
    {
        $transactions = Transaction::query()->with('user')->latest()->get();

        return response()->json($transactions->map(fn (Transaction $t) => self::adminPayload($t))->values());
    }

    public static function payload(Transaction $t): array
    {
        return [
            'id' => (string) $t->id,
            'userId' => (string) $t->user_id,
            'date' => $t->created_at->toISOString(),
            'type' => $t->type,
            'description' => $t->description,
            'amount' => (float) $t->amount,
            'currency' => $t->currency,
            'balanceAfter' => (float) $t->balance_after,
            'status' => $t->status,
            'reference' => $t->reference,
        ];
    }

    /** Same shape as payload(), enriched with the owner's name/email for admin tables (see resolveUser.ts). */
    public static function adminPayload(Transaction $t): array
    {
        $t->loadMissing('user');

        return self::payload($t) + [
            'userName' => $t->user?->full_name ?? 'Unknown user',
            'userEmail' => $t->user?->email ?? '—',
        ];
    }
}
