<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BonusHour;
use App\Models\EarningCycle;
use App\Models\Notification;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'identifier' => ['required', 'string'],
            'password' => ['required', 'string'],
            'role' => ['nullable', 'in:user,admin'],
        ]);

        $identifier = trim($validated['identifier']);

        $user = User::query()
            ->where('email', strtolower($identifier))
            ->orWhere('mobile', $identifier)
            ->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages(['identifier' => 'Invalid email/mobile or password.']);
        }

        if (! empty($validated['role']) && $user->role !== $validated['role']) {
            $message = $validated['role'] === 'admin'
                ? 'This account does not have admin access.'
                : 'Admin accounts must sign in from the admin login page.';
            throw ValidationException::withMessages(['identifier' => $message]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages(['identifier' => 'This account has been suspended.']);
        }

        $user->forceFill(['last_login_at' => now()])->save();

        return $this->sessionResponse($user);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'fullName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'mobile' => ['required', 'string', 'max:32', 'unique:users,mobile'],
            'password' => ['required', 'string', 'min:6'],
            'referralCode' => ['nullable', 'string'],
        ]);

        $user = DB::transaction(function () use ($validated) {
            $referredBy = null;
            if (! empty($validated['referralCode'])) {
                $referrer = User::query()->where('referral_code', $validated['referralCode'])->first();
                $referredBy = $referrer?->referral_code;
            }

            $user = User::create([
                'full_name' => $validated['fullName'],
                'email' => strtolower($validated['email']),
                'mobile' => $validated['mobile'],
                'password' => $validated['password'],
                'role' => 'user',
                'referral_code' => $this->generateReferralCode($validated['fullName']),
                'referred_by' => $referredBy,
            ]);

            Wallet::create(['user_id' => $user->id]);
            EarningCycle::create(['user_id' => $user->id, 'status' => 'ready', 'duration_minutes' => 60]);
            BonusHour::create(['user_id' => $user->id]);

            Notification::pushUser(
                $user->id,
                'Welcome to SilverQuantX',
                'Your account is ready. Add funds to activate your first package and start an earning cycle.'
            );
            Notification::pushAdmin('New user registered', "{$user->full_name} just created a new account.");

            return $user;
        });

        return $this->sessionResponse($user);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out.']);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $this->userPayload($request->user())]);
    }

    private function generateReferralCode(string $fullName): string
    {
        $base = strtoupper(substr(preg_replace('/[^A-Za-z]/', '', explode(' ', trim($fullName))[0]) ?: 'USER', 0, 6));

        do {
            $code = $base.random_int(10, 99);
        } while (User::query()->where('referral_code', $code)->exists());

        return $code;
    }

    private function sessionResponse(User $user): \Illuminate\Http\JsonResponse
    {
        $ttlMinutes = config('sanctum.expiration') ?? (60 * 24 * 7);
        $expiresAt = now()->addMinutes($ttlMinutes);

        $token = $user->createToken('sqx', ['*'], $expiresAt);

        return response()->json([
            'session' => [
                'userId' => (string) $user->id,
                'token' => $token->plainTextToken,
                'expiresAt' => $expiresAt->toISOString(),
            ],
            'user' => $this->userPayload($user),
        ]);
    }

    public static function userPayload(User $user): array
    {
        return [
            'id' => (string) $user->id,
            'fullName' => $user->full_name,
            'email' => $user->email,
            'mobile' => $user->mobile,
            'role' => $user->role,
            'referralCode' => $user->referral_code,
            'referredBy' => $user->referred_by,
            'createdAt' => $user->created_at->toISOString(),
        ];
    }
}
