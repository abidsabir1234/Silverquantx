<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EarningCycle;
use App\Models\Transaction;
use App\Models\UserPackage;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class EarningCycleController extends Controller
{
    public function show(Request $request)
    {
        $cycle = $this->currentCycle($request->user()->id);

        return response()->json(self::payload($cycle));
    }

    public function start(Request $request)
    {
        $cycle = $this->currentCycle($request->user()->id);

        if (! in_array($cycle->status, ['ready', 'claimed'], true)) {
            throw ValidationException::withMessages(['cycle' => 'Cycle cannot be started right now.']);
        }

        $cycle->update([
            'status' => 'running',
            'started_at' => now(),
            'ends_at' => now()->addMinutes($cycle->duration_minutes),
        ]);

        return response()->json(self::payload($cycle));
    }

    public function claim(Request $request)
    {
        $user = $request->user();
        $cycle = $this->currentCycle($user->id);

        if ($cycle->status !== 'claim_available') {
            throw ValidationException::withMessages(['cycle' => 'Nothing available to claim yet.']);
        }

        $amountClaimed = DB::transaction(function () use ($user, $cycle) {
            $current = UserPackage::query()->where('user_id', $user->id)->where('is_current', true)->first();
            $hourlyRate = $current ? (float) $current->hourly_rate : 0.0;
            $amountClaimed = round($hourlyRate * ($cycle->duration_minutes / 60), 2);

            $cycle->update([
                'status' => 'claimed',
                'started_at' => null,
                'ends_at' => null,
                'last_claimed_at' => now(),
            ]);

            $wallet = Wallet::query()->lockForUpdate()->firstOrCreate(['user_id' => $user->id]);
            $wallet->increment('available_balance', $amountClaimed);
            $wallet->increment('total_earnings', $amountClaimed);

            if ($amountClaimed > 0) {
                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'earning',
                    'description' => 'Earning cycle claimed',
                    'amount' => $amountClaimed,
                    'balance_after' => $wallet->fresh()->available_balance,
                    'status' => 'completed',
                    'reference' => 'EARN'.now()->valueOf(),
                ]);
            }

            return $amountClaimed;
        });

        return response()->json(['cycle' => self::payload($cycle->fresh()), 'amountClaimed' => $amountClaimed]);
    }

    private function currentCycle(int $userId): EarningCycle
    {
        $cycle = EarningCycle::firstOrCreate(['user_id' => $userId], ['status' => 'ready', 'duration_minutes' => 60]);

        if ($cycle->status === 'running' && $cycle->ends_at && $cycle->ends_at->isPast()) {
            $cycle->update(['status' => 'claim_available']);
        }

        return $cycle;
    }

    public static function payload(EarningCycle $cycle): array
    {
        return [
            'status' => $cycle->status,
            'startedAt' => $cycle->started_at?->toISOString(),
            'endsAt' => $cycle->ends_at?->toISOString(),
            'durationMinutes' => $cycle->duration_minutes,
            'lastClaimedAt' => $cycle->last_claimed_at?->toISOString(),
        ];
    }
}
