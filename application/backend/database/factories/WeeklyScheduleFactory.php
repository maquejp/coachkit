<?php

namespace Database\Factories;

use App\Models\WeeklySchedule;
use App\Models\ClassType;
use App\Models\Coach;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

class WeeklyScheduleFactory extends Factory
{
    protected $model = WeeklySchedule::class;

    public function definition(): array
    {
        return [
            'class_type_id' => ClassType::factory(),
            'coach_id' => Coach::factory(),
            'location_id' => Location::factory(),
            'day_of_week' => fake()->numberBetween(1, 7),
            'start_time' => '09:00',
            'end_time' => '10:00',
            'max_capacity' => 20,
            'is_active' => true,
        ];
    }
}
