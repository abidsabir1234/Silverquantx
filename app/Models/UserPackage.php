<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPackage extends Model
{
    protected $fillable = [
        'user_id',
        'package_id',
        'name',
        'amount',
        'hourly_rate',
        'is_current',
        'status',
        'started_at',
        'expires_at',
        'ended_at',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'hourly_rate' => 'decimal:4',
            'is_current' => 'boolean',
            'started_at' => 'datetime',
            'expires_at' => 'datetime',
            'ended_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    /** Resolves an active row to 'expired' once its expiry has passed — mirrors the earlier mock's resolveCurrentPackage(). */
    public function resolveExpiry(): self
    {
        if ($this->status === 'active' && $this->expires_at->isPast()) {
            $this->status = 'expired';
            $this->save();
        }

        return $this;
    }
}
