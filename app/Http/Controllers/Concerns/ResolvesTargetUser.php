<?php

namespace App\Http\Controllers\Concerns;

use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

trait ResolvesTargetUser
{
    /**
     * Returns the account a request should act on: the caller's own account, or —
     * only when the caller is an admin and passes ?user_id= — another account.
     * Mirrors the mock services' `userId?: string` admin-view parameter.
     */
    protected function resolveTargetUser(Request $request): User
    {
        $requester = $request->user();
        $userId = $request->query('user_id');

        if ($userId === null) {
            return $requester;
        }

        if ($requester->role !== 'admin') {
            throw new HttpException(403, 'Forbidden.');
        }

        $target = User::find($userId);

        if (! $target) {
            throw new HttpException(404, 'User not found.');
        }

        return $target;
    }
}
