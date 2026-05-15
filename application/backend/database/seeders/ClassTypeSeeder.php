<?php

namespace Database\Seeders;

use App\Models\ClassType;
use Illuminate\Database\Seeder;

class ClassTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name' => 'Morning Yoga',
                'slug' => 'morning-yoga',
                'description' => 'Gentle stretches and mindfulness to start your day.',
                'color' => '#0ea5e9',
                'intensity_level' => 'beginner',
                'duration_minutes' => 60,
                'max_capacity' => 25,
                'default_price_cents' => 2000,
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'HIIT Circuit',
                'slug' => 'hiit-circuit',
                'description' => 'High-intensity interval training for maximum results.',
                'color' => '#f43f5e',
                'intensity_level' => 'advanced',
                'duration_minutes' => 45,
                'max_capacity' => 20,
                'default_price_cents' => 2500,
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Pilates Flow',
                'slug' => 'pilates-flow',
                'description' => 'Core-strengthening Pilates with controlled movements.',
                'color' => '#14b8a6',
                'intensity_level' => 'intermediate',
                'duration_minutes' => 50,
                'max_capacity' => 20,
                'default_price_cents' => 2200,
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Strength & Tone',
                'slug' => 'strength-tone',
                'description' => 'Build lean muscle with resistance training.',
                'color' => '#f59e0b',
                'intensity_level' => 'intermediate',
                'duration_minutes' => 45,
                'max_capacity' => 18,
                'default_price_cents' => 2300,
                'sort_order' => 4,
                'is_active' => true,
            ],
            [
                'name' => 'Boxing Fitness',
                'slug' => 'boxing-fitness',
                'description' => 'Cardio boxing combining technique and endurance.',
                'color' => '#ef4444',
                'intensity_level' => 'advanced',
                'duration_minutes' => 50,
                'max_capacity' => 16,
                'default_price_cents' => 2800,
                'sort_order' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Meditation',
                'slug' => 'meditation',
                'description' => 'Guided meditation for relaxation and focus.',
                'color' => '#8b5cf6',
                'intensity_level' => 'beginner',
                'duration_minutes' => 30,
                'max_capacity' => 30,
                'default_price_cents' => 1500,
                'sort_order' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($types as $ct) {
            ClassType::query()->updateOrCreate(
                ['slug' => $ct['slug']],
                $ct,
            );
        }
    }
}
