<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BotPassPlan extends Model
{
    protected $fillable = [
        'name',
        'price',
        'duration_days',
        'cycle_duration_minutes',
        'cycle_reward',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'cycle_reward' => 'decimal:2',
        ];
    }
}
