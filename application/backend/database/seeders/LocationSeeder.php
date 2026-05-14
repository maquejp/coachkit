<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            [
                'name' => 'CoachKit Downtown',
                'slug' => 'coachkit-downtown',
                'address' => '123 Main Street',
                'city' => 'Portland',
                'postal_code' => '97201',
                'phone' => '+1-555-1001',
                'email' => 'downtown@coachkit.test',
                'google_maps_url' => 'https://maps.example.com/downtown',
                'is_active' => true,
            ],
            [
                'name' => 'CoachKit Eastside',
                'slug' => 'coachkit-eastside',
                'address' => '456 Oak Avenue',
                'city' => 'Portland',
                'postal_code' => '97202',
                'phone' => '+1-555-1002',
                'email' => 'eastside@coachkit.test',
                'google_maps_url' => 'https://maps.example.com/eastside',
                'is_active' => true,
            ],
            [
                'name' => 'CoachKit West Hills',
                'slug' => 'coachkit-west-hills',
                'address' => '789 Pine Road',
                'city' => 'Portland',
                'postal_code' => '97203',
                'phone' => '+1-555-1003',
                'email' => 'westhills@coachkit.test',
                'google_maps_url' => null,
                'is_active' => true,
            ],
        ];

        foreach ($locations as $loc) {
            Location::query()->updateOrCreate(
                ['slug' => $loc['slug']],
                $loc,
            );
        }
    }
}
