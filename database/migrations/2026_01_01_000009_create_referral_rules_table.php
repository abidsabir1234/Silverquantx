<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('referral_rules', function (Blueprint $table) {
            $table->id();
            $table->decimal('bonus_hours_per_referral', 10, 2)->default(1);
            $table->decimal('min_deposit_for_eligibility', 12, 2)->default(20);
            $table->boolean('program_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('referral_rules');
    }
};
