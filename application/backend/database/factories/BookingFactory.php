<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\User;
use App\Models\WeeklySchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'schedule_id' => WeeklySchedule::factory(),
            'booking_date' => fake()->dateTimeBetween('+1 day', '+1 month')->format('Y-m-d'),
            'status' => 'confirmed',
        ];
    }
}
