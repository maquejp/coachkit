<?php

namespace Database\Seeders;

use App\Models\WaitlistEntry;
use App\Models\User;
use App\Models\WeeklySchedule;
use Illuminate\Database\Seeder;

class WaitlistSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'customer')->get();
        $schedules = WeeklySchedule::all();

        $entries = [
            ['user_idx' => 0, 'schedule_idx' => 0, 'status' => 'waiting'],
            ['user_idx' => 1, 'schedule_idx' => 1, 'status' => 'waiting'],
            ['user_idx' => 2, 'schedule_idx' => 0, 'status' => 'promoted'],
            ['user_idx' => 3, 'schedule_idx' => 2, 'status' => 'waiting'],
            ['user_idx' => 4, 'schedule_idx' => 1, 'status' => 'cancelled'],
        ];

        foreach ($entries as $e) {
            if (!isset($users[$e['user_idx']]) || !isset($schedules[$e['schedule_idx']])) continue;

            WaitlistEntry::query()->updateOrCreate(
                [
                    'user_id' => $users[$e['user_idx']]->id,
                    'schedule_id' => $schedules[$e['schedule_idx']]->id,
                    'date' => now()->addDays(7)->format('Y-m-d'),
                ],
                [
                    'status' => $e['status'],
                ],
            );
        }
    }
}
