<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::query()->where('role', 'user')->with(['wallet', 'currentPackage'])->get();
        $referralCounts = User::query()->where('role', 'user')->whereNotNull('referred_by')
            ->selectRaw('referred_by, count(*) as aggregate')->groupBy('referred_by')->pluck('aggregate', 'referred_by');

        return response()->json($users->map(fn (User $u) => self::payload($u, $referralCounts))->values());
    }

    public function show(User $user)
    {
        if ($user->role !== 'user') {
            abort(404);
        }

        $referralCounts = User::query()->where('role', 'user')->where('referred_by', $user->referral_code)->count();

        return response()->json(self::payload($user->load(['wallet', 'currentPackage']), collect([$user->referral_code => $referralCounts])));
    }

    public function setStatus(Request $request, User $user)
    {
        $validated = $request->validate(['status' => ['required', 'in:active,suspended']]);
        $user->update(['status' => $validated['status']]);

        return $this->index();
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        ]);

        $mapped = [];
        if (array_key_exists('name', $validated)) $mapped['full_name'] = $validated['name'];
        if (array_key_exists('email', $validated)) $mapped['email'] = strtolower($validated['email']);
        $user->update($mapped);

        return $this->index();
    }

    public static function payload(User $u, $referralCounts): array
    {
        return [
            'id' => (string) $u->id,
            'name' => $u->full_name,
            'email' => $u->email,
            'mobile' => $u->mobile,
            'registeredAt' => $u->created_at->toISOString(),
            'balance' => (float) ($u->wallet->available_balance ?? 0),
            'packageName' => $u->currentPackage?->name,
            'status' => $u->status,
            'referrals' => (int) ($referralCounts[$u->referral_code] ?? 0),
        ];
    }
}
