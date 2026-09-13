<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminSetting extends Model
{
    protected $fillable = [
        'site_name',
        'support_email',
        'maintenance_mode',
        'tagline',
        'primary_color_hex',
        'email_alerts_enabled',
        'sms_alerts_enabled',
        'new_user_alerts',
        'two_factor_required',
        'session_timeout_minutes',
    ];

    protected function casts(): array
    {
        return [
            'maintenance_mode' => 'boolean',
            'email_alerts_enabled' => 'boolean',
            'sms_alerts_enabled' => 'boolean',
            'new_user_alerts' => 'boolean',
            'two_factor_required' => 'boolean',
        ];
    }

    public static function current(): self
    {
        return static::query()->latest('id')->first() ?? static::create([]);
    }
}
