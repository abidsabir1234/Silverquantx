<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BonusHour extends Model
{
    protected $table = 'bonus_hours';

    protected $fillable = [
        'user_id',
        'available',
        'pending',
        'used',
        'total_earned',
    ];

    protected function casts(): array
    {
        return [
            'available' => 'decimal:2',
            'pending' => 'decimal:2',
            'used' => 'decimal:2',
            'total_earned' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
