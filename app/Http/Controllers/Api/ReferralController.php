<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Concerns\ResolvesTargetUser;
use App\Http\Controllers\Controller;
use App\Models\BonusHour;
use App\Models\ReferralRule;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class ReferralController extends Controller
{
    use ResolvesTargetUser;

    public function bonusHours(Request $request)
    {
        $user = $this->resolveTargetUser($request);
        $summary = BonusHour::firstOrCreate(['user_id' => $user->id]);

        return response()->json(self::bonusHoursPayload($summary));
    }

    public function stats(Request $request)
    {
        $user = $this->resolveTargetUser($request);
        $entries = $this->buildEntries($user);
        $summary = BonusHour::firstOrCreate(['user_id' => $user->id]);

        return response()->json([
            'totalReferrals' => $entries->count(),
            'activeReferrals' => $entries->where('status', 'active')->count(),
            'bonusHours' => (float) $summary->available,
            'pendingBonusHours' => round($entries->where('bonusStatus', 'pending')->sum('bonusHours'), 2),
        ]);
    }

    public function list(Request $request)
    {
        $user = $this->resolveTargetUser($request);

        return response()->json($this->buildEntries($user)->values());
    }

    public function activity(Request $request)
    {
        $user = $this->resolveTargetUser($request);
        $entries = $this->buildEntries($user);

        $counts = [];
        $order = [];
        foreach ($entries as $entry) {
            $label = \Illuminate\Support\Carbon::parse($entry['joinedAt'])->format('M');
            if (! isset($counts[$label])) {
                $counts[$label] = 0;
                $order[] = $label;
            }
            $counts[$label]++;
        }

        return response()->json(collect($order)->map(fn ($label) => ['label' => $label, 'referrals' => $counts[$label]])->values());
    }

    public function claim(Request $request)
    {
        $user = $request->user();
        $entries = $this->buildEntries($user);
        $eligible = $entries->where('bonusStatus', 'pending')->where('bonusHours', '>', 0);

        if ($eligible->isEmpty()) {
            throw ValidationException::withMessages(['bonus' => 'No bonus hours available to claim.']);
        }

        $summary = DB::transaction(function () use ($user, $eligible) {
            $claimedTotal = round($eligible->sum('bonusHours'), 2);

            User::query()->whereIn('id', $eligible->pluck('id'))->update(['referral_bonus_status' => 'claimed']);

            $summary = BonusHour::query()->lockForUpdate()->firstOrCreate(['user_id' => $user->id]);
            $summary->update([
                'available' => round((float) $summary->available + $claimedTotal, 2),
                'total_earned' => round((float) $summary->total_earned + $claimedTotal, 2),
                'pending' => 0,
            ]);

            return $summary;
        });

        return response()->json(self::bonusHoursPayload($summary));
    }

    // --- Admin-scoped ---

    public function allBonusHoursSummary()
    {
        $totals = ['available' => 0.0, 'used' => 0.0, 'totalEarned' => 0.0, 'pending' => 0.0];

        User::query()->where('role', 'user')->with('bonusHours')->each(function (User $u) use (&$totals) {
            $summary = $u->bonusHours;
            $totals['available'] += (float) ($summary?->available ?? 0);
            $totals['used'] += (float) ($summary?->used ?? 0);
            $totals['totalEarned'] += (float) ($summary?->total_earned ?? 0);
            $totals['pending'] += $this->buildEntries($u)->where('bonusStatus', 'pending')->sum('bonusHours');
        });

        return response()->json([
            'available' => round($totals['available'], 2),
            'used' => round($totals['used'], 2),
            'totalEarned' => round($totals['totalEarned'], 2),
            'pending' => round($totals['pending'], 2),
        ]);
    }

    public function allReferrals()
    {
        $referred = User::query()->where('role', 'user')->whereNotNull('referred_by')->get();
        $referrersByCode = User::query()->where('role', 'user')->get()->keyBy('referral_code');

        $seen = [];
        $result = collect();
        foreach ($referred as $u) {
            $referrer = $referrersByCode->get($u->referred_by);
            if (! $referrer || isset($seen[$u->id])) {
                continue;
            }
            $seen[$u->id] = true;
            $result->push($this->entryPayload($u, $referrer));
        }

        return response()->json($result->values());
    }

    public function setStatus(Request $request, User $referredUser)
    {
        $validated = $request->validate(['status' => ['required', 'in:active,inactive']]);
        $referredUser->update(['referral_status' => $validated['status']]);

        return $this->allReferrals();
    }

    public function setBonusStatus(Request $request, User $referredUser)
    {
        $validated = $request->validate(['bonusStatus' => ['required', 'in:pending,claimed']]);
        $referredUser->update(['referral_bonus_status' => $validated['bonusStatus']]);

        return $this->allReferrals();
    }

    /** @return Collection<int, array> */
    private function buildEntries(User $referrer): Collection
    {
        $rules = ReferralRule::current();

        return User::query()
            ->where('role', 'user')
            ->where('referred_by', $referrer->referral_code)
            ->get()
            ->map(fn (User $u) => $this->entryPayload($u, $referrer, $rules));
    }

    private function entryPayload(User $referred, User $referrer, ?ReferralRule $rules = null): array
    {
        $rules ??= ReferralRule::current();

        $totalDeposits = Transaction::query()
            ->where('user_id', $referred->id)
            ->where('type', 'deposit')
            ->where('status', 'completed')
            ->sum('amount');

        $eligible = $rules->program_active && (float) $totalDeposits >= (float) $rules->min_deposit_for_eligibility;
        $claimed = $referred->referral_bonus_status === 'claimed';

        return [
            'id' => (string) $referred->id,
            'userName' => $referred->full_name,
            'joinedAt' => $referred->created_at->toISOString(),
            'status' => $referred->referral_status,
            'bonusHours' => ($eligible || $claimed) ? (float) $rules->bonus_hours_per_referral : 0.0,
            'bonusStatus' => $claimed ? 'claimed' : 'pending',
        ];
    }

    public static function bonusHoursPayload(BonusHour $summary): array
    {
        return [
            'available' => (float) $summary->available,
            'pending' => (float) $summary->pending,
            'used' => (float) $summary->used,
            'totalEarned' => (float) $summary->total_earned,
        ];
    }
}
