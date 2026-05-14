<?php

namespace Database\Seeders;

use App\Models\Coach;
use Illuminate\Database\Seeder;

class CoachSeeder extends Seeder
{
    public function run(): void
    {
        $coaches = [
            [
                'first_name' => 'Alex',
                'last_name' => 'Rivera',
                'bio' => 'Yoga & Mindfulness instructor with 10 years of experience.',
                'photo_url' => null,
                'email' => 'alex@coachkit.test',
                'phone' => '+1-555-2001',
                'is_active' => true,
            ],
            [
                'first_name' => 'Jordan',
                'last_name' => 'Chen',
                'bio' => 'HIIT and Strength training specialist. Certified personal trainer.',
                'photo_url' => null,
                'email' => 'jordan@coachkit.test',
                'phone' => '+1-555-2002',
                'is_active' => true,
            ],
            [
                'first_name' => 'Sam',
                'last_name' => 'Taylor',
                'bio' => 'Pilates and Meditation expert. Helping people move better.',
                'photo_url' => null,
                'email' => 'sam@coachkit.test',
                'phone' => '+1-555-2003',
                'is_active' => true,
            ],
            [
                'first_name' => 'Maya',
                'last_name' => 'Patel',
                'bio' => 'Boxing fitness coach. Former competitive athlete.',
                'photo_url' => null,
                'email' => 'maya@coachkit.test',
                'phone' => '+1-555-2004',
                'is_active' => true,
            ],
        ];

        foreach ($coaches as $c) {
            Coach::query()->updateOrCreate(
                ['email' => $c['email']],
                $c,
            );
        }
    }
}
