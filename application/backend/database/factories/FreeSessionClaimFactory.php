<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\FreeSessionClaim;
use Illuminate\Database\Eloquent\Factories\Factory;

class FreeSessionClaimFactory extends Factory
{
    protected $model = FreeSessionClaim::class;

    public function definition(): array
    {
        return [
            'email' => fake()->email(),
            'booking_id' => Booking::factory(),
            'claimed_at' => now(),
        ];
    }
}
