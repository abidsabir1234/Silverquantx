<?php

namespace Database\Seeders;

use App\Models\AdminAccount;
use App\Models\AdminSetting;
use App\Models\BonusHour;
use App\Models\BotPassPlan;
use App\Models\EarningCycle;
use App\Models\ExchangeRate;
use App\Models\Package;
use App\Models\PaymentMethod;
use App\Models\ReferralRule;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@quantx123gmail.com'],
            [
                'full_name' => 'Platform Admin',
                'mobile' => '+92 300 0000000',
                'password' => 'password123',
                'role' => 'admin',
                'admin_role' => 'super_admin',
                'referral_code' => 'ADMIN01',
            ]
        );
        Wallet::firstOrCreate(['user_id' => $admin->id]);
        EarningCycle::firstOrCreate(['user_id' => $admin->id], ['status' => 'ready', 'duration_minutes' => 60]);
        BonusHour::firstOrCreate(['user_id' => $admin->id]);

        AdminAccount::firstOrCreate(
            ['email' => 'admin@quantx123gmail.com'],
            ['name' => 'Platform Admin', 'role' => 'super_admin', 'status' => 'active', 'last_login_at' => now()]
        );

        $packages = [
            ['name' => 'Starter', 'amount' => 1, 'duration_days' => 5, 'hourly_rate' => 0.004],
            ['name' => 'Basic', 'amount' => 10, 'duration_days' => 5, 'hourly_rate' => 0.04],
            ['name' => 'Plus', 'amount' => 50, 'duration_days' => 5, 'hourly_rate' => 0.20],
            ['name' => 'Growth', 'amount' => 100, 'duration_days' => 5, 'hourly_rate' => 0.42, 'featured' => true],
            ['name' => 'Advanced', 'amount' => 500, 'duration_days' => 7, 'hourly_rate' => 2.20],
            ['name' => 'Professional', 'amount' => 1000, 'duration_days' => 7, 'hourly_rate' => 4.50],
            ['name' => 'Elite', 'amount' => 5000, 'duration_days' => 10, 'hourly_rate' => 23.00],
            ['name' => 'Premier', 'amount' => 10000, 'duration_days' => 10, 'hourly_rate' => 47.00],
        ];
        foreach ($packages as $plan) {
            Package::firstOrCreate(['name' => $plan['name']], $plan + ['status' => 'active', 'featured' => false]);
        }

        $botPlans = [
            ['name' => 'Bot Starter', 'price' => 15, 'duration_days' => 30, 'cycle_duration_minutes' => 180],
            ['name' => 'Bot Plus', 'price' => 35, 'duration_days' => 30, 'cycle_duration_minutes' => 120],
            ['name' => 'Bot Pro', 'price' => 60, 'duration_days' => 30, 'cycle_duration_minutes' => 60],
        ];
        foreach ($botPlans as $plan) {
            BotPassPlan::firstOrCreate(['name' => $plan['name']], $plan + ['cycle_reward' => 1.5, 'status' => 'active']);
        }

        $paymentMethods = [
            ['key' => 'easypaisa', 'name' => 'Easypaisa', 'fee_percent' => 1.5],
            ['key' => 'jazzcash', 'name' => 'JazzCash', 'fee_percent' => 1.5],
            ['key' => 'bank-transfer', 'name' => 'Bank Transfer', 'fee_percent' => 1],
            ['key' => 'crypto', 'name' => 'Crypto', 'fee_percent' => 0.5],
            ['key' => 'usdt', 'name' => 'USDT', 'fee_percent' => 0.5],
        ];
        foreach ($paymentMethods as $method) {
            PaymentMethod::firstOrCreate(['key' => $method['key']], $method + ['type' => 'both', 'status' => 'active']);
        }

        ExchangeRate::firstOrCreate([], ['rate' => 280, 'previous_rate' => 278, 'updated_by' => 'Platform Admin']);
        ReferralRule::firstOrCreate([], ['bonus_hours_per_referral' => 1, 'min_deposit_for_eligibility' => 20, 'program_active' => true]);
        AdminSetting::firstOrCreate([]);
    }
}
