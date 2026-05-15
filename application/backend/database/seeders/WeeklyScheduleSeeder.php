<?php

namespace Database\Seeders;

use App\Models\WeeklySchedule;
use App\Models\ClassType;
use App\Models\Coach;
use App\Models\Location;
use Illuminate\Database\Seeder;

class WeeklyScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $classTypes = ClassType::all()->keyBy('slug');
        $coaches = Coach::all()->keyBy('email');
        $locations = Location::all()->keyBy('slug');

        $schedules = [
            // Monday
            ['day_of_week' => 1, 'class_type_slug' => 'morning-yoga', 'coach_email' => 'alex@coachkit.test', 'location_slug' => 'coachkit-downtown', 'start_time' => '07:00', 'end_time' => '08:00', 'max_capacity' => 25],
            ['day_of_week' => 1, 'class_type_slug' => 'hiit-circuit', 'coach_email' => 'jordan@coachkit.test', 'location_slug' => 'coachkit-eastside', 'start_time' => '07:00', 'end_time' => '08:00', 'max_capacity' => 20],
            ['day_of_week' => 1, 'class_type_slug' => 'meditation', 'coach_email' => 'sam@coachkit.test', 'location_slug' => 'coachkit-west-hills', 'start_time' => '07:00', 'end_time' => '08:00', 'max_capacity' => 30],
            ['day_of_week' => 1, 'class_type_slug' => 'pilates-flow', 'coach_email' => 'sam@coachkit.test', 'location_slug' => 'coachkit-downtown', 'start_time' => '08:00', 'end_time' => '08:50', 'max_capacity' => 20],
            ['day_of_week' => 1, 'class_type_slug' => 'boxing-fitness', 'coach_email' => 'maya@coachkit.test', 'location_slug' => 'coachkit-eastside', 'start_time' => '08:00', 'end_time' => '08:50', 'max_capacity' => 16],
            ['day_of_week' => 1, 'class_type_slug' => 'morning-yoga', 'coach_email' => 'alex@coachkit.test', 'location_slug' => 'coachkit-downtown', 'start_time' => '09:00', 'end_time' => '10:00', 'max_capacity' => 25],
            // Tuesday
            ['day_of_week' => 2, 'class_type_slug' => 'pilates-flow', 'coach_email' => 'sam@coachkit.test', 'location_slug' => 'coachkit-downtown', 'start_time' => '08:00', 'end_time' => '08:50', 'max_capacity' => 20],
            ['day_of_week' => 2, 'class_type_slug' => 'strength-tone', 'coach_email' => 'jordan@coachkit.test', 'location_slug' => 'coachkit-eastside', 'start_time' => '10:00', 'end_time' => '10:45', 'max_capacity' => 18],
            // Wednesday
            ['day_of_week' => 3, 'class_type_slug' => 'morning-yoga', 'coach_email' => 'alex@coachkit.test', 'location_slug' => 'coachkit-downtown', 'start_time' => '07:00', 'end_time' => '08:00', 'max_capacity' => 25],
            ['day_of_week' => 3, 'class_type_slug' => 'strength-tone', 'coach_email' => 'jordan@coachkit.test', 'location_slug' => 'coachkit-downtown', 'start_time' => '10:00', 'end_time' => '10:45', 'max_capacity' => 18],
            // Thursday
            ['day_of_week' => 4, 'class_type_slug' => 'pilates-flow', 'coach_email' => 'sam@coachkit.test', 'location_slug' => 'coachkit-downtown', 'start_time' => '08:00', 'end_time' => '08:50', 'max_capacity' => 20],
            ['day_of_week' => 4, 'class_type_slug' => 'hiit-circuit', 'coach_email' => 'jordan@coachkit.test', 'location_slug' => 'coachkit-eastside', 'start_time' => '17:30', 'end_time' => '18:15', 'max_capacity' => 20],
            // Friday
            ['day_of_week' => 5, 'class_type_slug' => 'morning-yoga', 'coach_email' => 'alex@coachkit.test', 'location_slug' => 'coachkit-downtown', 'start_time' => '07:00', 'end_time' => '08:00', 'max_capacity' => 25],
            ['day_of_week' => 5, 'class_type_slug' => 'boxing-fitness', 'coach_email' => 'maya@coachkit.test', 'location_slug' => 'coachkit-eastside', 'start_time' => '18:00', 'end_time' => '18:50', 'max_capacity' => 16],
            // Saturday
            ['day_of_week' => 6, 'class_type_slug' => 'meditation', 'coach_email' => 'alex@coachkit.test', 'location_slug' => 'coachkit-downtown', 'start_time' => '09:00', 'end_time' => '09:30', 'max_capacity' => 30],
        ];

        foreach ($schedules as $s) {
            WeeklySchedule::query()->updateOrCreate(
                [
                    'day_of_week' => $s['day_of_week'],
                    'start_time' => $s['start_time'],
                    'location_id' => $locations[$s['location_slug']]->id,
                ],
                [
                    'class_type_id' => $classTypes[$s['class_type_slug']]->id,
                    'coach_id' => $coaches[$s['coach_email']]->id,
                    'location_id' => $locations[$s['location_slug']]->id,
                    'end_time' => $s['end_time'],
                    'max_capacity' => $s['max_capacity'],
                    'is_active' => true,
                ],
            );
        }
    }
}
