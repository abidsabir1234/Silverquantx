<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;
use App\Models\ExchangeRate;
use App\Models\PaymentMethod;
use App\Models\ReferralRule;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function exchangeRate()
    {
        return response()->json(self::exchangeRatePayload(ExchangeRate::current()));
    }

    public function updateExchangeRate(Request $request)
    {
        $validated = $request->validate(['rate' => ['required', 'numeric', 'min:0.0001']]);
        $current = ExchangeRate::current();

        $updated = ExchangeRate::create([
            'rate' => $validated['rate'],
            'previous_rate' => $current->rate,
            'updated_by' => $request->user()->full_name,
        ]);

        return response()->json(self::exchangeRatePayload($updated));
    }

    public function referralRules()
    {
        return response()->json(self::referralRulesPayload(ReferralRule::current()));
    }

    public function updateReferralRules(Request $request)
    {
        $validated = $request->validate([
            'bonusHoursPerReferral' => ['required', 'numeric', 'min:0'],
            'minDepositForEligibility' => ['required', 'numeric', 'min:0'],
            'programActive' => ['required', 'boolean'],
        ]);

        $rules = ReferralRule::current();
        $rules->update([
            'bonus_hours_per_referral' => $validated['bonusHoursPerReferral'],
            'min_deposit_for_eligibility' => $validated['minDepositForEligibility'],
            'program_active' => $validated['programActive'],
        ]);

        return response()->json(self::referralRulesPayload($rules));
    }

    public function paymentMethods()
    {
        $methods = PaymentMethod::query()->orderBy('name')->get();

        return response()->json($methods->map(fn (PaymentMethod $m) => self::paymentMethodPayload($m))->values());
    }

    public function updatePaymentMethod(Request $request, PaymentMethod $paymentMethod)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'in:deposit,withdrawal,both'],
            'feePercent' => ['sometimes', 'numeric', 'min:0'],
            'status' => ['sometimes', 'in:active,inactive'],
        ]);

        $mapped = [];
        if (array_key_exists('name', $validated)) $mapped['name'] = $validated['name'];
        if (array_key_exists('type', $validated)) $mapped['type'] = $validated['type'];
        if (array_key_exists('feePercent', $validated)) $mapped['fee_percent'] = $validated['feePercent'];
        if (array_key_exists('status', $validated)) $mapped['status'] = $validated['status'];

        $paymentMethod->update($mapped);

        $methods = PaymentMethod::query()->orderBy('name')->get();

        return response()->json($methods->map(fn (PaymentMethod $m) => self::paymentMethodPayload($m))->values());
    }

    public function adminSettings()
    {
        return response()->json(self::adminSettingsPayload(AdminSetting::current()));
    }

    public function updateAdminSettings(Request $request)
    {
        $validated = $request->validate([
            'general.siteName' => ['required', 'string', 'max:255'],
            'general.supportEmail' => ['required', 'email', 'max:255'],
            'general.maintenanceMode' => ['required', 'boolean'],
            'brand.tagline' => ['required', 'string', 'max:255'],
            'brand.primaryColorHex' => ['required', 'string', 'max:16'],
            'notifications.emailAlertsEnabled' => ['required', 'boolean'],
            'notifications.smsAlertsEnabled' => ['required', 'boolean'],
            'notifications.newUserAlerts' => ['required', 'boolean'],
            'security.twoFactorRequired' => ['required', 'boolean'],
            'security.sessionTimeoutMinutes' => ['required', 'integer', 'min:1'],
        ]);

        $settings = AdminSetting::current();
        $settings->update([
            'site_name' => $validated['general']['siteName'],
            'support_email' => $validated['general']['supportEmail'],
            'maintenance_mode' => $validated['general']['maintenanceMode'],
            'tagline' => $validated['brand']['tagline'],
            'primary_color_hex' => $validated['brand']['primaryColorHex'],
            'email_alerts_enabled' => $validated['notifications']['emailAlertsEnabled'],
            'sms_alerts_enabled' => $validated['notifications']['smsAlertsEnabled'],
            'new_user_alerts' => $validated['notifications']['newUserAlerts'],
            'two_factor_required' => $validated['security']['twoFactorRequired'],
            'session_timeout_minutes' => $validated['security']['sessionTimeoutMinutes'],
        ]);

        return response()->json(self::adminSettingsPayload($settings));
    }

    public static function exchangeRatePayload(ExchangeRate $r): array
    {
        return [
            'rate' => (float) $r->rate,
            'previousRate' => (float) $r->previous_rate,
            'updatedBy' => $r->updated_by,
            'updatedAt' => $r->created_at->toISOString(),
        ];
    }

    public static function referralRulesPayload(ReferralRule $r): array
    {
        return [
            'bonusHoursPerReferral' => (float) $r->bonus_hours_per_referral,
            'minDepositForEligibility' => (float) $r->min_deposit_for_eligibility,
            'programActive' => (bool) $r->program_active,
        ];
    }

    public static function paymentMethodPayload(PaymentMethod $m): array
    {
        return [
            'id' => $m->key,
            'name' => $m->name,
            'type' => $m->type,
            'feePercent' => (float) $m->fee_percent,
            'status' => $m->status,
        ];
    }

    public static function adminSettingsPayload(AdminSetting $s): array
    {
        return [
            'general' => [
                'siteName' => $s->site_name,
                'supportEmail' => $s->support_email,
                'maintenanceMode' => (bool) $s->maintenance_mode,
            ],
            'brand' => [
                'tagline' => $s->tagline,
                'primaryColorHex' => $s->primary_color_hex,
            ],
            'notifications' => [
                'emailAlertsEnabled' => (bool) $s->email_alerts_enabled,
                'smsAlertsEnabled' => (bool) $s->sms_alerts_enabled,
                'newUserAlerts' => (bool) $s->new_user_alerts,
            ],
            'security' => [
                'twoFactorRequired' => (bool) $s->two_factor_required,
                'sessionTimeoutMinutes' => $s->session_timeout_minutes,
            ],
        ];
    }
}
