<?php

namespace Database\Factories;

use App\Models\Coach;
use Illuminate\Database\Eloquent\Factories\Factory;

class CoachFactory extends Factory
{
    protected $model = Coach::class;

    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'bio' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
