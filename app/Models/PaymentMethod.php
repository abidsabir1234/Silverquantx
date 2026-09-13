<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    protected $fillable = [
        'key',
        'name',
        'type',
        'fee_percent',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'fee_percent' => 'decimal:2',
        ];
    }
}
