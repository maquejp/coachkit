<?php

namespace Database\Seeders;

use App\Models\ScheduleException;
use App\Models\Location;
use Illuminate\Database\Seeder;

class ScheduleExceptionSeeder extends Seeder
{
    public function run(): void
    {
        $locations = Location::all()->keyBy('slug');

        $exceptions = [
            [
                'location_slug' => 'coachkit-downtown',
                'date' => now()->addMonths(6)->format('Y-12-25'),
                'is_closed' => true,
                'reason' => 'Christmas Day',
            ],
            [
                'location_slug' => 'coachkit-eastside',
                'date' => now()->addMonths(6)->format('Y-12-25'),
                'is_closed' => true,
                'reason' => 'Christmas Day',
            ],
            [
                'location_slug' => 'coachkit-west-hills',
                'date' => now()->addMonths(6)->format('Y-12-25'),
                'is_closed' => true,
                'reason' => 'Christmas Day',
            ],
            [
                'location_slug' => 'coachkit-downtown',
                'date' => now()->addMonth()->format('Y-m-d'),
                'is_closed' => false,
                'open_time' => '08:00',
                'close_time' => '14:00',
                'reason' => 'Staff training — Early closure',
            ],
        ];

        foreach ($exceptions as $ex) {
            ScheduleException::query()->updateOrCreate(
                [
                    'location_id' => $locations[$ex['location_slug']]->id,
                    'date' => $ex['date'],
                ],
                [
                    'is_closed' => $ex['is_closed'],
                    'open_time' => $ex['open_time'] ?? null,
                    'close_time' => $ex['close_time'] ?? null,
                    'reason' => $ex['reason'],
                ],
            );
        }
    }
}
