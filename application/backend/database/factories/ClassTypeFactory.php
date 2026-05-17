<?php

namespace Database\Factories;

use App\Models\ClassType;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClassTypeFactory extends Factory
{
    protected $model = ClassType::class;

    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'slug' => fake()->unique()->slug(1),
            'description' => fake()->sentence(),
            'color' => fake()->hexColor(),
            'duration_minutes' => fake()->randomElement([30, 45, 60, 90]),
            'max_capacity' => fake()->numberBetween(10, 30),
            'is_active' => true,
        ];
    }
}
