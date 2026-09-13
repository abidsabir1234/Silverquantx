<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id',
        'is_admin',
        'title',
        'message',
        'read',
    ];

    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',
            'read' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function pushAdmin(string $title, string $message): self
    {
        return static::create([
            'user_id' => null,
            'is_admin' => true,
            'title' => $title,
            'message' => $message,
            'read' => false,
        ]);
    }

    public static function pushUser(int $userId, string $title, string $message): self
    {
        return static::create([
            'user_id' => $userId,
            'is_admin' => false,
            'title' => $title,
            'message' => $message,
            'read' => false,
        ]);
    }
}
