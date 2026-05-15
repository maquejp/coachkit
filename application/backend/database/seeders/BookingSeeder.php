<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\User;
use App\Models\WeeklySchedule;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'customer')->get();
        $schedules = WeeklySchedule::all();

        $statuses = ['confirmed', 'confirmed', 'confirmed', 'cancelled', 'attended', 'no_show', 'confirmed', 'confirmed', 'attended', 'cancelled', 'confirmed', 'attended'];

        foreach ($statuses as $i => $status) {
            $user = $users[$i % count($users)];
            $schedule = $schedules[$i % count($schedules)];

            $bookingDate = $status === 'attended'
                ? now()->subDays(rand(1, 14))
                : now()->addDays(rand(1, 30));

            Booking::query()->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'schedule_id' => $schedule->id,
                    'booking_date' => $bookingDate->format('Y-m-d'),
                ],
                [
                    'status' => $status,
                    'source' => 'web',
                    'cancelled_at' => $status === 'cancelled' ? now()->subDays(rand(1, 5)) : null,
                ],
            );
        }

        // Also create 2 guest bookings
        $guestSchedules = [$schedules[0], $schedules[1]];
        foreach ($guestSchedules as $i => $gs) {
            Booking::query()->updateOrCreate(
                [
                    'user_id' => null,
                    'schedule_id' => $gs->id,
                    'booking_date' => now()->addDays(3 + $i)->format('Y-m-d'),
                ],
                [
                    'status' => 'confirmed',
                    'guest_email' => "guest" . ($i + 1) . "@example.test",
                    'source' => 'guest',
                ],
            );
        }
    }
}
