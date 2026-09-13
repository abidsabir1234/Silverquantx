<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $items = Notification::query()->where('user_id', $request->user()->id)->latest()->get();

        return response()->json($items->map(fn (Notification $n) => self::payload($n))->values());
    }

    public function markRead(Request $request, Notification $notification)
    {
        abort_unless($notification->user_id === $request->user()->id, 404);
        $notification->update(['read' => true]);

        return $this->index($request);
    }

    public function markAllRead(Request $request)
    {
        Notification::query()->where('user_id', $request->user()->id)->update(['read' => true]);

        return $this->index($request);
    }

    // --- Admin-scoped ---

    public function adminIndex()
    {
        $items = Notification::query()->where('is_admin', true)->latest()->get();

        return response()->json($items->map(fn (Notification $n) => self::payload($n))->values());
    }

    public function adminMarkRead(Notification $notification)
    {
        abort_unless($notification->is_admin, 404);
        $notification->update(['read' => true]);

        return $this->adminIndex();
    }

    public function adminMarkAllRead()
    {
        Notification::query()->where('is_admin', true)->update(['read' => true]);

        return $this->adminIndex();
    }

    public static function payload(Notification $n): array
    {
        return [
            'id' => (string) $n->id,
            'title' => $n->title,
            'message' => $n->message,
            'createdAt' => $n->created_at->toISOString(),
            'read' => (bool) $n->read,
        ];
    }
}
