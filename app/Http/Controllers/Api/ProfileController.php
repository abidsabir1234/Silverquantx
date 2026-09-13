<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'fullName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'mobile' => ['required', 'string', 'max:32', Rule::unique('users', 'mobile')->ignore($user->id)],
        ]);

        $user->update([
            'full_name' => $validated['fullName'],
            'email' => strtolower($validated['email']),
            'mobile' => $validated['mobile'],
        ]);

        return response()->json(['user' => AuthController::userPayload($user)]);
    }
}
