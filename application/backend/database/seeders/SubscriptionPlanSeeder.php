<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Drop-In',
                'description' => 'Pay per session, no commitment.',
                'type' => 'sessions',
                'sessions_per_week' => null,
                'price_cents' => 2000,
                'interval' => 'monthly',
                'commitment_months' => null,
                'insurance_fee_cents' => 0,
                'trial_days' => 0,
                'is_active' => true,
                'features' => ['Single class access', 'No commitment', 'Valid for 30 days'],
            ],
            [
                'name' => 'Monthly Unlimited',
                'description' => 'Unlimited classes every month.',
                'type' => 'unlimited',
                'sessions_per_week' => null,
                'price_cents' => 9900,
                'interval' => 'monthly',
                'commitment_months' => 1,
                'insurance_fee_cents' => 500,
                'trial_days' => 7,
                'is_active' => true,
                'features' => ['Unlimited classes', 'Priority booking', 'Free guest pass', 'Cancel anytime'],
            ],
            [
                'name' => 'Annual Unlimited',
                'description' => 'Best value — two months free.',
                'type' => 'unlimited',
                'sessions_per_week' => null,
                'price_cents' => 89900,
                'interval' => 'yearly',
                'commitment_months' => 12,
                'insurance_fee_cents' => 500,
                'trial_days' => 7,
                'is_active' => true,
                'features' => ['Everything in Monthly', '2 months free', 'Exclusive workshops', 'Member events'],
            ],
            [
                'name' => 'Student Monthly',
                'description' => 'Discounted rate for students.',
                'type' => 'unlimited',
                'sessions_per_week' => null,
                'price_cents' => 6900,
                'interval' => 'monthly',
                'commitment_months' => 1,
                'insurance_fee_cents' => 500,
                'trial_days' => 7,
                'is_active' => true,
                'features' => ['Unlimited classes', 'Valid student ID required', 'Priority booking'],
            ],
        ];

        foreach ($plans as $p) {
            SubscriptionPlan::query()->updateOrCreate(
                ['name' => $p['name']],
                $p,
            );
        }
    }
}
