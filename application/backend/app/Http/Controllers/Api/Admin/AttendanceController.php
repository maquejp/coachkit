<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function checkInBookings(Request $request): JsonResponse
    {
        $date = $request->query('date', now()->format('Y-m-d'));

        $bookings = Booking::where('booking_date', $date)
            ->with('schedule.classType')
            ->get();

        $userIds = $bookings->pluck('user_id')->filter()->unique()->values()->all();
        $users = User::whereIn('id', $userIds)->get()->keyBy('id');

        $checkedIn = Attendance::whereDate('attended_at', $date)
            ->get()
            ->keyBy('booking_id');

        return response()->json([
            'success' => true,
            'data' => $bookings->map(function ($b) use ($users, $checkedIn) {
                $user = $b->user_id && $users->has($b->user_id) ? $users->get($b->user_id) : null;
                $att = $checkedIn->get($b->id);

                return [
                    'id' => $b->id,
                    'userId' => $b->user_id,
                    'guestEmail' => $b->guest_email,
                    'classTypeId' => $b->schedule?->class_type_id,
                    'date' => $b->booking_date,
                    'status' => $b->status,
                    'customerName' => $user ? $user->first_name . ' ' . $user->last_name : ($b->guest_email ?? 'Guest'),
                    'className' => $b->schedule?->classType?->name ?? 'Unknown',
                    'classColor' => $b->schedule?->classType?->color ?? '#ccc',
                    'checkInTime' => $att ? $att->attended_at->format('H:i:s') : null,
                ];
            }),
        ]);
    }

    public function checkIn(Request $request): JsonResponse
    {
        $validated = $request->validate(['bookingId' => 'required|integer|exists:bookings,id']);

        $booking = Booking::find($validated['bookingId']);

        $existing = Attendance::where('booking_id', $booking->id)->first();
        if ($existing) {
            return response()->json([
                'success' => true,
                'data' => ['id' => $existing->id, 'checkInTime' => $existing->attended_at->format('H:i:s')],
            ]);
        }

        $attendance = Attendance::create([
            'booking_id' => $booking->id,
            'user_id' => $booking->user_id,
            'class_type_id' => $booking->schedule?->class_type_id,
            'attended_at' => now(),
            'marked_by' => $request->user()->id,
        ]);

        $booking->update(['status' => 'attended']);

        return response()->json([
            'success' => true,
            'data' => ['id' => $attendance->id, 'checkInTime' => $attendance->attended_at->format('H:i:s')],
        ], 201);
    }

    public function report(Request $request): JsonResponse
    {
        $from = $request->query('from', now()->subMonth()->format('Y-m-d'));
        $to = $request->query('to', now()->format('Y-m-d'));

        $records = Attendance::whereDate('attended_at', '>=', $from)
            ->whereDate('attended_at', '<=', $to)
            ->with('booking.schedule.classType')
            ->get();

        $mapped = $records->map(function ($a) {
            $user = $a->user_id ? User::find($a->user_id) : null;
            return [
                'id' => $a->id,
                'bookingId' => $a->booking_id,
                'userId' => $a->user_id,
                'date' => $a->attended_at?->format('Y-m-d'),
                'checkInTime' => $a->attended_at?->format('H:i:s'),
                'customerName' => $user ? $user->first_name . ' ' . $user->last_name : 'Unknown',
                'className' => $a->booking?->schedule?->classType?->name ?? 'Unknown',
                'classColor' => $a->booking?->schedule?->classType?->color ?? '#ccc',
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $mapped->count(),
                'records' => $mapped,
            ],
        ]);
    }
}
