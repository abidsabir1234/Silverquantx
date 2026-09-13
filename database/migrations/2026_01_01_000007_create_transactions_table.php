<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['deposit', 'withdrawal', 'earning', 'referral', 'bonus', 'package']);
            $table->string('description');
            $table->decimal('amount', 14, 2);
            $table->string('currency', 8)->default('USD');
            $table->decimal('balance_after', 14, 2);
            $table->enum('status', ['completed', 'pending', 'processing', 'rejected'])->default('pending');
            $table->string('reference')->index();
            $table->string('method')->nullable();
            $table->string('account_details')->nullable();
            $table->string('proof_path')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
