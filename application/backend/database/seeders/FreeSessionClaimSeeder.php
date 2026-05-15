<?php

namespace Database\Seeders;

use App\Models\FreeSessionClaim;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Database\Seeder;

class FreeSessionClaimSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'customer')->get();
        $bookings = Booking::where('status', 'confirmed')->take(3)->get();

        $claims = [
            ['email' => 'guest1@example.test', 'user_idx' => null, 'booking_idx' => 0],
            ['email' => 'guest2@example.test', 'user_idx' => null, 'booking_idx' => 1],
            ['email' => $users[0]->email, 'user_idx' => 0, 'booking_idx' => 2],
        ];

        foreach ($claims as $i => $c) {
            if (!isset($bookings[$c['booking_idx']])) continue;

            FreeSessionClaim::query()->updateOrCreate(
                ['email' => $c['email']],
                [
                    'user_id' => $c['user_idx'] !== null ? ($users[$c['user_idx']]->id ?? null) : null,
                    'booking_id' => $bookings[$c['booking_idx']]->id,
                    'claimed_at' => now()->subDays($i * 2),
                ],
            );
        }
    }
}
