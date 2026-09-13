<?php

use App\Http\Controllers\Api\Admin\AdminAccountController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BotPassController;
use App\Http\Controllers\Api\DepositController;
use App\Http\Controllers\Api\EarningCycleController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PackageController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ReferralController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\StatsController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\WithdrawController;
use Illuminate\Support\Facades\Route;

// --- Public ---

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/stats/platform', [StatsController::class, 'platform']);
Route::get('/packages', [PackageController::class, 'index']);

// --- Authenticated (any signed-in user) ---

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/wallet', [WalletController::class, 'show']);

    Route::get('/packages/current', [PackageController::class, 'current']);
    Route::get('/packages/history', [PackageController::class, 'history']);
    Route::post('/packages/activate', [PackageController::class, 'activate']);

    Route::get('/earning-cycle', [EarningCycleController::class, 'show']);
    Route::post('/earning-cycle/start', [EarningCycleController::class, 'start']);
    Route::post('/earning-cycle/claim', [EarningCycleController::class, 'claim']);

    Route::get('/bot-pass', [BotPassController::class, 'show']);
    Route::post('/bot-pass/start', [BotPassController::class, 'start']);
    Route::post('/bot-pass/claim', [BotPassController::class, 'claim']);

    Route::get('/referrals/stats', [ReferralController::class, 'stats']);
    Route::get('/referrals', [ReferralController::class, 'list']);
    Route::get('/referrals/activity', [ReferralController::class, 'activity']);
    Route::post('/referrals/claim-bonus-hours', [ReferralController::class, 'claim']);
    Route::get('/bonus-hours', [ReferralController::class, 'bonusHours']);

    Route::post('/deposits', [DepositController::class, 'store']);
    Route::post('/withdrawals', [WithdrawController::class, 'store']);
    Route::get('/transactions', [TransactionController::class, 'index']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllRead']);

    Route::get('/settings/exchange-rate', [SettingsController::class, 'exchangeRate']);
    Route::get('/settings/payment-methods', [SettingsController::class, 'paymentMethods']);
});

// --- Admin-only ---

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard/charts', [DashboardController::class, 'charts']);

    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{user}', [AdminUserController::class, 'show']);
    Route::put('/users/{user}', [AdminUserController::class, 'update']);
    Route::post('/users/{user}/status', [AdminUserController::class, 'setStatus']);

    Route::post('/packages', [PackageController::class, 'store']);
    Route::put('/packages/{package}', [PackageController::class, 'update']);
    Route::post('/packages/{package}/status', [PackageController::class, 'setStatus']);

    Route::get('/bot-pass-plans', [BotPassController::class, 'plans']);
    Route::post('/bot-pass-plans', [BotPassController::class, 'storePlan']);
    Route::put('/bot-pass-plans/{botPassPlan}', [BotPassController::class, 'updatePlan']);
    Route::post('/bot-pass-plans/{botPassPlan}/status', [BotPassController::class, 'setPlanStatus']);

    Route::get('/deposits', [DepositController::class, 'index']);
    Route::post('/deposits/{transaction}/approve', [DepositController::class, 'approve']);
    Route::post('/deposits/{transaction}/reject', [DepositController::class, 'reject']);

    Route::get('/withdrawals', [WithdrawController::class, 'index']);
    Route::post('/withdrawals/{transaction}/approve', [WithdrawController::class, 'approve']);
    Route::post('/withdrawals/{transaction}/process', [WithdrawController::class, 'process']);
    Route::post('/withdrawals/{transaction}/reject', [WithdrawController::class, 'reject']);

    Route::get('/transactions', [TransactionController::class, 'adminIndex']);

    Route::get('/referrals', [ReferralController::class, 'allReferrals']);
    Route::get('/referrals/bonus-hours-summary', [ReferralController::class, 'allBonusHoursSummary']);
    Route::post('/referrals/{referredUser}/status', [ReferralController::class, 'setStatus']);
    Route::post('/referrals/{referredUser}/bonus-status', [ReferralController::class, 'setBonusStatus']);

    Route::get('/payment-methods', [SettingsController::class, 'paymentMethods']);
    Route::put('/payment-methods/{paymentMethod}', [SettingsController::class, 'updatePaymentMethod']);

    Route::get('/exchange-rate', [SettingsController::class, 'exchangeRate']);
    Route::put('/exchange-rate', [SettingsController::class, 'updateExchangeRate']);

    Route::get('/referral-rules', [SettingsController::class, 'referralRules']);
    Route::put('/referral-rules', [SettingsController::class, 'updateReferralRules']);

    Route::get('/notifications', [NotificationController::class, 'adminIndex']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'adminMarkRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'adminMarkAllRead']);

    Route::get('/settings', [SettingsController::class, 'adminSettings']);
    Route::put('/settings', [SettingsController::class, 'updateAdminSettings']);

    Route::get('/admin-accounts', [AdminAccountController::class, 'index']);
    Route::post('/admin-accounts', [AdminAccountController::class, 'store']);
    Route::put('/admin-accounts/{adminAccount}', [AdminAccountController::class, 'update']);
    Route::post('/admin-accounts/{adminAccount}/status', [AdminAccountController::class, 'setStatus']);
});
