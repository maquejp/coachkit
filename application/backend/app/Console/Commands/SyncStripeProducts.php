<?php

namespace App\Console\Commands;

use App\Models\PointCardPlan;
use App\Models\SubscriptionPlan;
use App\Services\StripeService;
use Illuminate\Console\Command;
use Stripe\Exception\ApiErrorException;

class SyncStripeProducts extends Command
{
    protected $signature = 'stripe:sync-products';
    protected $description = 'Sync subscription and point card plans to Stripe products and prices';

    public function handle(StripeService $stripe): int
    {
        $this->info('Syncing subscription plans...');

        SubscriptionPlan::all()->each(function (SubscriptionPlan $plan) use ($stripe) {
            try {
                $stripe->syncProduct($plan);
                $this->line("  ✓ {$plan->name} (ID: {$plan->id})");
            } catch (ApiErrorException $e) {
                $this->error("  ✗ {$plan->name}: {$e->getMessage()}");
            }
        });

        $this->info('Syncing point card plans...');

        PointCardPlan::all()->each(function (PointCardPlan $plan) use ($stripe) {
            try {
                $stripe->syncPointCardProduct($plan);
                $this->line("  ✓ {$plan->name} (ID: {$plan->id})");
            } catch (ApiErrorException $e) {
                $this->error("  ✗ {$plan->name}: {$e->getMessage()}");
            }
        });

        $this->info('Done.');

        return self::SUCCESS;
    }
}
