<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    private function defaults(): array
    {
        return [
            'studioName' => 'CoachKit Studio',
            'studioEmail' => 'hello@coachkit.app',
            'studioPhone' => '+1-555-0100',
            'studioAddress' => '123 Main Street',
            'studioCity' => 'Portland',
            'timezone' => 'America/New_York',
            'defaultCurrency' => 'EUR',
            'businessHours' => [
                1 => ['open' => '06:00', 'close' => '21:00', 'isClosed' => false],
                2 => ['open' => '06:00', 'close' => '21:00', 'isClosed' => false],
                3 => ['open' => '06:00', 'close' => '21:00', 'isClosed' => false],
                4 => ['open' => '06:00', 'close' => '21:00', 'isClosed' => false],
                5 => ['open' => '06:00', 'close' => '20:00', 'isClosed' => false],
                6 => ['open' => '08:00', 'close' => '18:00', 'isClosed' => false],
                0 => ['open' => '08:00', 'close' => '14:00', 'isClosed' => true],
            ],
            'bookingLeadTimeMinutes' => 60,
            'cancellationWindowMinutes' => 120,
            'maxBookingsPerCustomer' => 5,
            'defaultEmailSender' => 'noreply@coachkit.app',
            'notifyOnBooking' => true,
            'notifyOnCancellation' => true,
            'notifyOnWaitlist' => true,
            'notifyOnReminder' => true,
            'taxRate' => 8.5,
        ];
    }

    public function show(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->defaults(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $defaults = $this->defaults();

        $merged = array_merge($defaults, $request->all());

        if (isset($merged['businessHours']) && is_array($merged['businessHours'])) {
            foreach ($merged['businessHours'] as $day => $hours) {
                $defaultHours = $defaults['businessHours'][(int) $day] ?? ['open' => '09:00', 'close' => '17:00', 'isClosed' => false];
                $merged['businessHours'][$day] = array_merge($defaultHours, $hours);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $merged,
        ]);
    }
}
