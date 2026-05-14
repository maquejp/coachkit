<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            LocationSeeder::class,
            CoachSeeder::class,
            ClassTypeSeeder::class,
            WeeklyScheduleSeeder::class,
            ScheduleExceptionSeeder::class,
            SubscriptionPlanSeeder::class,
            PointCardPlanSeeder::class,
            // These depend on users + plans existing
            CustomerSubscriptionSeeder::class,
            PointCardPurchaseSeeder::class,
            // Booking depends on weekly_schedule
            BookingSeeder::class,
            // These depend on bookings
            FreeSessionClaimSeeder::class,
            AttendanceSeeder::class,
            WaitlistSeeder::class,
            PaymentTransactionSeeder::class,
        ]);
    }
}
