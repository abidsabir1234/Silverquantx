<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminAccount;
use Illuminate\Http\Request;

class AdminAccountController extends Controller
{
    public function index()
    {
        $accounts = AdminAccount::query()->orderBy('name')->get();

        return response()->json($accounts->map(fn (AdminAccount $a) => self::payload($a))->values());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'role' => ['required', 'in:super_admin,admin,support'],
        ]);

        AdminAccount::create($validated + ['status' => 'active', 'last_login_at' => now()]);

        return $this->index();
    }

    public function update(Request $request, AdminAccount $adminAccount)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255'],
            'role' => ['sometimes', 'in:super_admin,admin,support'],
        ]);

        $adminAccount->update($validated);

        return $this->index();
    }

    public function setStatus(Request $request, AdminAccount $adminAccount)
    {
        $validated = $request->validate(['status' => ['required', 'in:active,suspended']]);
        $adminAccount->update(['status' => $validated['status']]);

        return $this->index();
    }

    public static function payload(AdminAccount $a): array
    {
        return [
            'id' => (string) $a->id,
            'name' => $a->name,
            'email' => $a->email,
            'role' => $a->role,
            'status' => $a->status,
            'lastLoginAt' => $a->last_login_at?->toISOString() ?? $a->created_at->toISOString(),
        ];
    }
}
