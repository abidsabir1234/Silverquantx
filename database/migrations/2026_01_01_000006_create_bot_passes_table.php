<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bot_passes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->foreignId('plan_id')->nullable()->constrained('bot_pass_plans')->nullOnDelete();
            $table->enum('status', ['active', 'inactive', 'expired'])->default('inactive');
            $table->timestamp('pass_expires_at')->nullable();
            $table->unsignedInteger('cycle_duration_minutes')->default(180);
            $table->decimal('cycle_reward', 10, 2)->default(1.5);
            $table->enum('cycle_status', ['idle', 'running', 'claim_available', 'claimed'])->default('idle');
            $table->timestamp('cycle_started_at')->nullable();
            $table->timestamp('cycle_ends_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bot_passes');
    }
};
