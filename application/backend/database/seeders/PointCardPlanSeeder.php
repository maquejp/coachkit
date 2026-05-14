<?php

namespace Database\Seeders;

use App\Models\PointCardPlan;
use Illuminate\Database\Seeder;

class PointCardPlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => '5-Class Pack',
                'description' => '5 sessions to use anytime.',
                'sessions_count' => 5,
                'price_cents' => 9000,
                'validity_days' => 90,
                'is_active' => true,
            ],
            [
                'name' => '10-Class Pack',
                'description' => 'Best value per session.',
                'sessions_count' => 10,
                'price_cents' => 16000,
                'validity_days' => 180,
                'is_active' => true,
            ],
            [
                'name' => '20-Class Pack',
                'description' => 'Our most popular pack.',
                'sessions_count' => 20,
                'price_cents' => 28000,
                'validity_days' => 365,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $p) {
            PointCardPlan::query()->updateOrCreate(
                ['name' => $p['name']],
                $p,
            );
        }
    }
}
