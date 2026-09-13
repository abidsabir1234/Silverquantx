<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'full_name',
        'email',
        'mobile',
        'password',
        'role',
        'admin_role',
        'referral_code',
        'referred_by',
        'referral_status',
        'referral_bonus_status',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function wallet(): HasOne
    {
        return $this->hasOne(Wallet::class);
    }

    public function earningCycle(): HasOne
    {
        return $this->hasOne(EarningCycle::class);
    }

    public function botPass(): HasOne
    {
        return $this->hasOne(BotPass::class);
    }

    public function bonusHours(): HasOne
    {
        return $this->hasOne(BonusHour::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(UserPackage::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function currentPackage(): HasOne
    {
        return $this->hasOne(UserPackage::class)->where('is_current', true);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
