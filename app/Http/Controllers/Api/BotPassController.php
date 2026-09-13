<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BotPass;
use App\Models\BotPassPlan;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BotPassController extends Controller
{
    public function show(Request $request)
    {
        $pass = $this->currentPass($request->user()->id);

        return response()->json(self::payload($pass));
    }

    public function start(Request $request)
    {
        $pass = $this->currentPass($request->user()->id);

        if ($pass->status !== 'active') {
            throw ValidationException::withMessages(['cycle' => 'Bot Pass is not active.']);
        }
        if (! in_array($pass->cycle_status, ['idle', 'claimed'], true)) {
            throw ValidationException::withMessages(['cycle' => 'Bot cycle cannot be started right now.']);
        }

        $pass->update([
            'cycle_status' => 'running',
            'cycle_started_at' => now(),
            'cycle_ends_at' => now()->addMinutes($pass->cycle_duration_minutes),
        ]);

        return response()->json(self::payload($pass));
    }

    public function claim(Request $request)
    {
        $user = $request->user();
        $pass = $this->currentPass($user->id);

        if ($pass->cycle_status !== 'claim_available') {
            throw ValidationException::withMessages(['cycle' => 'Nothing available to claim yet.']);
        }

        $amountClaimed = DB::transaction(function () use ($user, $pass) {
            $reward = (float) $pass->cycle_reward;

            $pass->update([
                'cycle_status' => 'claimed',
                'cycle_started_at' => null,
                'cycle_ends_at' => null,
            ]);

            $wallet = Wallet::query()->lockForUpdate()->firstOrCreate(['user_id' => $user->id]);
            $wallet->increment('available_balance', $reward);
            $wallet->increment('total_earnings', $reward);

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'earning',
                'description' => 'Bot Pass cycle claimed',
                'amount' => $reward,
                'balance_after' => $wallet->fresh()->available_balance,
                'status' => 'completed',
                'reference' => 'BOT'.now()->valueOf(),
            ]);

            return $reward;
        });

        return response()->json(['pass' => self::payload($pass->fresh()), 'amountClaimed' => $amountClaimed]);
    }

    private function currentPass(int $userId): BotPass
    {
        $pass = BotPass::firstOrCreate(['user_id' => $userId], [
            'status' => 'inactive',
            'cycle_duration_minutes' => 180,
            'cycle_status' => 'idle',
        ]);

        return $pass->resolveStatus();
    }

    public static function payload(BotPass $pass): array
    {
        return [
            'status' => $pass->status,
            'passExpiresAt' => $pass->pass_expires_at?->toISOString() ?? now()->subDay()->toISOString(),
            'cycleDurationMinutes' => $pass->cycle_duration_minutes,
            'cycle' => [
                'status' => $pass->cycle_status,
                'startedAt' => $pass->cycle_started_at?->toISOString(),
                'endsAt' => $pass->cycle_ends_at?->toISOString(),
            ],
        ];
    }

    // --- Admin-scoped: Bot Pass plan catalog ---

    public function plans()
    {
        return response()->json(BotPassPlan::query()->orderBy('price')->get()->map(fn (BotPassPlan $p) => self::planPayload($p))->values());
    }

    public function storePlan(Request $request)
    {
        $validated = $this->validatedPlan($request);
        BotPassPlan::create($validated);

        return response()->json(BotPassPlan::query()->orderBy('price')->get()->map(fn (BotPassPlan $p) => self::planPayload($p))->values());
    }

    public function updatePlan(Request $request, BotPassPlan $botPassPlan)
    {
        $validated = $this->validatedPlan($request, partial: true);
        $botPassPlan->update($validated);

        return response()->json(BotPassPlan::query()->orderBy('price')->get()->map(fn (BotPassPlan $p) => self::planPayload($p))->values());
    }

    public function setPlanStatus(Request $request, BotPassPlan $botPassPlan)
    {
        $validated = $request->validate(['status' => ['required', 'in:active,inactive']]);
        $botPassPlan->update(['status' => $validated['status']]);

        return response()->json(BotPassPlan::query()->orderBy('price')->get()->map(fn (BotPassPlan $p) => self::planPayload($p))->values());
    }

    private function validatedPlan(Request $request, bool $partial = false): array
    {
        $rules = [
            'name' => [$partial ? 'sometimes' : 'required', 'string', 'max:255'],
            'price' => [$partial ? 'sometimes' : 'required', 'numeric', 'min:0'],
            'durationDays' => [$partial ? 'sometimes' : 'required', 'integer', 'min:1'],
            'cycleDurationMinutes' => [$partial ? 'sometimes' : 'required', 'integer', 'min:1'],
            'status' => ['sometimes', 'in:active,inactive'],
        ];
        $validated = $request->validate($rules);

        $mapped = [];
        if (array_key_exists('name', $validated)) $mapped['name'] = $validated['name'];
        if (array_key_exists('price', $validated)) $mapped['price'] = $validated['price'];
        if (array_key_exists('durationDays', $validated)) $mapped['duration_days'] = $validated['durationDays'];
        if (array_key_exists('cycleDurationMinutes', $validated)) $mapped['cycle_duration_minutes'] = $validated['cycleDurationMinutes'];
        if (array_key_exists('status', $validated)) $mapped['status'] = $validated['status'];

        if (! $partial) {
            $mapped['status'] = $mapped['status'] ?? 'active';
        }

        return $mapped;
    }

    public static function planPayload(BotPassPlan $p): array
    {
        return [
            'id' => (string) $p->id,
            'name' => $p->name,
            'price' => (float) $p->price,
            'durationDays' => $p->duration_days,
            'cycleDurationMinutes' => $p->cycle_duration_minutes,
            'status' => $p->status,
        ];
    }
}
