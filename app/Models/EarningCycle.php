<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EarningCycle extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'duration_minutes',
        'started_at',
        'ends_at',
        'last_claimed_at',
    ];

    protected function casts(): array
    {
        return [
            'started_at' => 'datetime',
            'ends_at' => 'datetime',
            'last_claimed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Recomputes status from anchor timestamps — mirrors the earlier mock's resolveCycle(). */
    public function resolveStatus(): self
    {
        if ($this->status === 'running' && $this->ends_at && $this->ends_at->isPast()) {
            $this->status = 'claim_available';
            $this->save();
        }

        return $this;
    }
}
