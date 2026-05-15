<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $response = Http::get('https://jsonplaceholder.typicode.com/users');

        if ($response->successful()) {
            $users = $response->json();

            foreach ($users as $i => $u) {
                $nameParts = explode(' ', $u['name'], 2);
                $role = $i === 0 ? 'admin' : 'customer';

                User::query()->updateOrCreate(
                    ['email' => $u['email']],
                    [
                        'first_name' => $nameParts[0],
                        'last_name' => $nameParts[1] ?? '',
                        'phone' => $u['phone'],
                        'role' => $role,
                        'password' => bcrypt('password'),
                        'email_verified_at' => now(),
                    ],
                );
            }
        }

        // Also create instructor users (linked to CoachSeeder)
        $instructors = [
            ['email' => 'alex@coachkit.test', 'first_name' => 'Alex', 'last_name' => 'Rivera', 'phone' => '+1-555-2001'],
            ['email' => 'jordan@coachkit.test', 'first_name' => 'Jordan', 'last_name' => 'Chen', 'phone' => '+1-555-2002'],
            ['email' => 'sam@coachkit.test', 'first_name' => 'Sam', 'last_name' => 'Taylor', 'phone' => '+1-555-2003'],
            ['email' => 'maya@coachkit.test', 'first_name' => 'Maya', 'last_name' => 'Patel', 'phone' => '+1-555-2004'],
        ];

        foreach ($instructors as $inst) {
            User::query()->updateOrCreate(
                ['email' => $inst['email']],
                [
                    'first_name' => $inst['first_name'],
                    'last_name' => $inst['last_name'],
                    'phone' => $inst['phone'],
                    'role' => 'instructor',
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ],
            );
        }
    }
}
