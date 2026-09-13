<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BotPass extends Model
{
    protected $attributes = [
        'cycle_reward' => 1.5,
    ];

    protected $fillable = [
        'user_id',
        'plan_id',
        'status',
        'pass_expires_at',
        'cycle_duration_minutes',
        'cycle_reward',
        'cycle_status',
        'cycle_started_at',
        'cycle_ends_at',
    ];

    protected function casts(): array
    {
        return [
            'cycle_reward' => 'decimal:2',
            'pass_expires_at' => 'datetime',
            'cycle_started_at' => 'datetime',
            'cycle_ends_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(BotPassPlan::class, 'plan_id');
    }

    /** Recomputes pass expiry and cycle completion from anchor timestamps — mirrors the earlier mock's resolveBotPass(). */
    public function resolveStatus(): self
    {
        $dirty = false;

        if ($this->status === 'active' && $this->pass_expires_at && $this->pass_expires_at->isPast()) {
            $this->status = 'expired';
            $this->cycle_status = 'idle';
            $this->cycle_started_at = null;
            $this->cycle_ends_at = null;
            $dirty = true;
        }

        if ($this->cycle_status === 'running' && $this->cycle_ends_at && $this->cycle_ends_at->isPast()) {
            $this->cycle_status = 'claim_available';
            $dirty = true;
        }

        if ($dirty) {
            $this->save();
        }

        return $this;
    }
}
