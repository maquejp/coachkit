<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Booking;
use App\Models\User;
use App\Models\ClassType;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        if (!$admin) return;

        $bookings = Booking::whereIn('status', ['attended', 'confirmed'])->take(6)->get();
        $classTypes = ClassType::all();

        foreach ($bookings as $i => $b) {
            $classType = $classTypes[$i % count($classTypes)];

            Attendance::query()->updateOrCreate(
                ['booking_id' => $b->id],
                [
                    'user_id' => $b->user_id ?? $admin->id,
                    'class_type_id' => $classType->id,
                    'attended_at' => $b->status === 'attended' ? now()->subDays(rand(1, 14)) : null,
                    'marked_by' => $admin->id,
                    'check_in_method' => 'manual',
                ],
            );
        }
    }
}
