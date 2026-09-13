<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = [
        'name',
        'amount',
        'duration_days',
        'hourly_rate',
        'status',
        'featured',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'hourly_rate' => 'decimal:4',
            'featured' => 'boolean',
        ];
    }
}
