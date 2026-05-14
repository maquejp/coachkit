<?php

namespace Database\Seeders;

use App\Models\CustomerSubscription;
use App\Models\User;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class CustomerSubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'customer')->get();
        $plans = SubscriptionPlan::all()->keyBy('name');

        $subscriptions = [
            ['user_idx' => 0, 'plan' => 'Monthly Unlimited', 'status' => 'active', 'sessions_used' => 15],
            ['user_idx' => 1, 'plan' => 'Annual Unlimited', 'status' => 'active', 'sessions_used' => 87],
            ['user_idx' => 2, 'plan' => 'Monthly Unlimited', 'status' => 'active', 'sessions_used' => 22],
            ['user_idx' => 3, 'plan' => 'Drop-In', 'status' => 'active', 'sessions_used' => 3],
            ['user_idx' => 4, 'plan' => 'Monthly Unlimited', 'status' => 'cancelled', 'sessions_used' => 8],
            ['user_idx' => 5, 'plan' => 'Annual Unlimited', 'status' => 'expired', 'sessions_used' => 312],
        ];

        foreach ($subscriptions as $s) {
            if (!isset($users[$s['user_idx']])) continue;
            $plan = $plans[$s['plan']];
            $startDate = now()->subMonths(3);
            $endDate = $s['status'] === 'cancelled' ? now()->subMonth() : ($s['status'] === 'expired' ? now()->subDay() : null);

            CustomerSubscription::query()->updateOrCreate(
                [
                    'user_id' => $users[$s['user_idx']]->id,
                    'subscription_plan_id' => $plan->id,
                ],
                [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'sessions_used' => $s['sessions_used'],
                    'status' => $s['status'],
                    'auto_renew' => $s['status'] === 'active',
                    'cancelled_at' => $s['status'] === 'cancelled' ? now()->subMonth() : null,
                ],
            );
        }
    }
}
