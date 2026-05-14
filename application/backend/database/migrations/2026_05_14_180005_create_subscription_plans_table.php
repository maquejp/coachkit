<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('type', 20)->default('sessions');
            $table->integer('sessions_per_week')->nullable();
            $table->integer('price_cents');
            $table->string('interval', 20)->default('monthly');
            $table->integer('commitment_months')->nullable();
            $table->integer('insurance_fee_cents')->default(0);
            $table->integer('trial_days')->default(0);
            $table->boolean('is_active')->default(true);
            $table->string('stripe_price_id')->nullable();
            $table->json('features')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
