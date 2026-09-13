<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExchangeRate extends Model
{
    protected $fillable = [
        'rate',
        'previous_rate',
        'updated_by',
    ];

    protected function casts(): array
    {
        return [
            'rate' => 'decimal:4',
            'previous_rate' => 'decimal:4',
        ];
    }

    public static function current(): self
    {
        return static::query()->latest('id')->firstOrCreate([], [
            'rate' => 280,
            'previous_rate' => 280,
            'updated_by' => 'Platform Admin',
        ]);
    }
}
