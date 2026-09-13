<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReferralRule extends Model
{
    protected $fillable = [
        'bonus_hours_per_referral',
        'min_deposit_for_eligibility',
        'program_active',
    ];

    protected function casts(): array
    {
        return [
            'bonus_hours_per_referral' => 'decimal:2',
            'min_deposit_for_eligibility' => 'decimal:2',
            'program_active' => 'boolean',
        ];
    }

    public static function current(): self
    {
        return static::query()->latest('id')->firstOrCreate([], [
            'bonus_hours_per_referral' => 1,
            'min_deposit_for_eligibility' => 20,
            'program_active' => true,
        ]);
    }
}
