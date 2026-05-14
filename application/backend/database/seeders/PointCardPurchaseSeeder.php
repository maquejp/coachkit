<?php

namespace Database\Seeders;

use App\Models\PointCardPurchase;
use App\Models\User;
use App\Models\PointCardPlan;
use Illuminate\Database\Seeder;

class PointCardPurchaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'customer')->get();
        $plans = PointCardPlan::all()->keyBy('name');

        $purchases = [
            ['user_idx' => 7, 'plan' => '10-Class Pack', 'remaining' => 7],
            ['user_idx' => 8, 'plan' => '5-Class Pack', 'remaining' => 2],
            ['user_idx' => 9, 'plan' => '20-Class Pack', 'remaining' => 20],
        ];

        foreach ($purchases as $p) {
            if (!isset($users[$p['user_idx']])) continue;
            $plan = $plans[$p['plan']];

            PointCardPurchase::query()->updateOrCreate(
                [
                    'user_id' => $users[$p['user_idx']]->id,
                    'point_card_plan_id' => $plan->id,
                ],
                [
                    'sessions_remaining' => $p['remaining'],
                    'purchase_date' => now()->subDays(45),
                    'expiry_date' => now()->addDays($plan->validity_days - 45),
                ],
            );
        }
    }
}
