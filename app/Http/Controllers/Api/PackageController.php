<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ResolvesTargetUser;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Package;
use App\Models\Transaction;
use App\Models\UserPackage;
use App\Models\Wallet;
use App\Support\Formatting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PackageController extends Controller
{
    use ResolvesTargetUser;

    public function index()
    {
        $plans = Package::query()->orderBy('amount')->get();

        return response()->json($plans->map(fn (Package $p) => self::planPayload($p))->values());
    }

    public function current(Request $request)
    {
        $user = $this->resolveTargetUser($request);
        $current = UserPackage::query()->where('user_id', $user->id)->where('is_current', true)->first();
        $current?->resolveExpiry();

        return response()->json($current ? self::currentPayload($current) : null);
    }

    public function history(Request $request)
    {
        $user = $this->resolveTargetUser($request);
        $history = UserPackage::query()
            ->where('user_id', $user->id)
            ->where('is_current', false)
            ->orderByDesc('ended_at')
            ->get();

        return response()->json($history->map(fn (UserPackage $p) => self::historyPayload($p))->values());
    }

    public function activate(Request $request)
    {
        $validated = $request->validate([
            'planId' => ['required'],
        ]);

        $user = $request->user();
        $plan = Package::find($validated['planId']);

        if (! $plan || $plan->status !== 'active') {
            throw ValidationException::withMessages(['planId' => 'This package is not currently available.']);
        }

        $activated = DB::transaction(function () use ($user, $plan) {
            $wallet = Wallet::query()->lockForUpdate()->firstOrCreate(['user_id' => $user->id]);

            if ((float) $wallet->available_balance < (float) $plan->amount) {
                throw ValidationException::withMessages(['planId' => 'Insufficient wallet balance. Please deposit funds before activating this package.']);
            }

            $existing = UserPackage::query()->where('user_id', $user->id)->where('is_current', true)->first();
            if ($existing) {
                $existing->resolveExpiry();
                $existing->update([
                    'is_current' => false,
                    'status' => $existing->status === 'expired' ? 'expired' : 'completed',
                    'ended_at' => now(),
                ]);
            }

            $activated = UserPackage::create([
                'user_id' => $user->id,
                'package_id' => $plan->id,
                'name' => "{$plan->name} Package",
                'amount' => $plan->amount,
                'hourly_rate' => $plan->hourly_rate,
                'is_current' => true,
                'status' => 'active',
                'started_at' => now(),
                'expires_at' => now()->addDays($plan->duration_days),
            ]);

            $wallet->decrement('available_balance', $plan->amount);

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'package',
                'description' => "{$activated->name} activated",
                'amount' => -$plan->amount,
                'balance_after' => $wallet->fresh()->available_balance,
                'status' => 'completed',
                'reference' => 'PKG'.now()->valueOf(),
            ]);

            Notification::pushUser($user->id, 'Package activated', "Your {$activated->name} is now active.");

            return $activated;
        });

        return response()->json(self::currentPayload($activated));
    }

    // --- Admin-scoped catalog management ---

    public function store(Request $request)
    {
        $validated = $this->validatedPlan($request);
        $plan = Package::create($validated);

        return response()->json(Package::query()->orderBy('amount')->get()->map(fn (Package $p) => self::planPayload($p))->values());
    }

    public function update(Request $request, Package $package)
    {
        $validated = $this->validatedPlan($request, partial: true);
        $package->update($validated);

        return response()->json(Package::query()->orderBy('amount')->get()->map(fn (Package $p) => self::planPayload($p))->values());
    }

    public function setStatus(Request $request, Package $package)
    {
        $validated = $request->validate(['status' => ['required', 'in:active,inactive']]);
        $package->update(['status' => $validated['status']]);

        return response()->json(Package::query()->orderBy('amount')->get()->map(fn (Package $p) => self::planPayload($p))->values());
    }

    private function validatedPlan(Request $request, bool $partial = false): array
    {
        $rules = [
            'name' => [$partial ? 'sometimes' : 'required', 'string', 'max:255'],
            'amount' => [$partial ? 'sometimes' : 'required', 'numeric', 'min:0'],
            'duration' => [$partial ? 'sometimes' : 'required', 'integer', 'min:1'],
            'hourlyRate' => [$partial ? 'sometimes' : 'required', 'string'],
            'status' => ['sometimes', 'in:active,inactive'],
            'featured' => ['sometimes', 'boolean'],
        ];
        $validated = $request->validate($rules);

        $mapped = [];
        if (array_key_exists('name', $validated)) $mapped['name'] = $validated['name'];
        if (array_key_exists('amount', $validated)) $mapped['amount'] = $validated['amount'];
        if (array_key_exists('duration', $validated)) $mapped['duration_days'] = $validated['duration'];
        if (array_key_exists('hourlyRate', $validated)) $mapped['hourly_rate'] = Formatting::parseRate($validated['hourlyRate']);
        if (array_key_exists('status', $validated)) $mapped['status'] = $validated['status'];
        if (array_key_exists('featured', $validated)) $mapped['featured'] = $validated['featured'];

        if (! $partial) {
            $mapped['status'] = $mapped['status'] ?? 'active';
        }

        return $mapped;
    }

    public static function planPayload(Package $p): array
    {
        return [
            'id' => (string) $p->id,
            'name' => $p->name,
            'amount' => (float) $p->amount,
            'duration' => $p->duration_days,
            'hourlyRate' => Formatting::hourlyRate($p->hourly_rate),
            'status' => $p->status,
            'featured' => (bool) $p->featured,
        ];
    }

    public static function currentPayload(UserPackage $p): array
    {
        return [
            'id' => (string) ($p->package_id ?? $p->id),
            'name' => $p->name,
            'amount' => (float) $p->amount,
            'hourlyRate' => Formatting::hourlyRate($p->hourly_rate),
            'status' => $p->status,
            'startedAt' => $p->started_at->toISOString(),
            'expiresAt' => $p->expires_at->toISOString(),
        ];
    }

    public static function historyPayload(UserPackage $p): array
    {
        return [
            'id' => (string) $p->id,
            'name' => $p->name,
            'amount' => (float) $p->amount,
            'hourlyRate' => Formatting::hourlyRate($p->hourly_rate),
            'status' => $p->status === 'expired' ? 'expired' : 'completed',
            'startedAt' => $p->started_at->toISOString(),
            'endedAt' => ($p->ended_at ?? $p->expires_at)->toISOString(),
        ];
    }
}
