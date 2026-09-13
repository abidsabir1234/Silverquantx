<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $attributes = [
        'currency' => 'USD',
    ];

    protected $fillable = [
        'user_id',
        'type',
        'description',
        'amount',
        'currency',
        'balance_after',
        'status',
        'reference',
        'method',
        'account_details',
        'proof_path',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'balance_after' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
