<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('admin_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->default('SilverQuantX');
            $table->string('support_email')->default('support@silverquantx.com');
            $table->boolean('maintenance_mode')->default(false);
            $table->string('tagline')->default('Premium earning, simplified.');
            $table->string('primary_color_hex')->default('#C7CDD6');
            $table->boolean('email_alerts_enabled')->default(true);
            $table->boolean('sms_alerts_enabled')->default(false);
            $table->boolean('new_user_alerts')->default(true);
            $table->boolean('two_factor_required')->default(false);
            $table->unsignedInteger('session_timeout_minutes')->default(60);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin_settings');
    }
};
