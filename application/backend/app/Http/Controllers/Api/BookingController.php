<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\BookingConfirmationMail;
use App\Mail\CancellationConfirmationMail;
use App\Models\Booking;
use App\Models\Coach;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Booking::query();
        if ($userId = $request->query('userId')) {
            $query->where('user_id', $userId);
        }
        $bookings = $query->with('schedule.classType')->get();
        return response()->json([
            'success' => true,
            'data' => $bookings->map(fn ($b) => $this->format($b)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'scheduleId' => 'required|integer|exists:weekly_schedule,id',
            'bookingDate' => 'required|date',
            'guestEmail' => 'nullable|email',
            'source' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);
        $booking = Booking::query()->create([
            'user_id' => $request->user()->id,
            'schedule_id' => $data['scheduleId'],
            'booking_date' => $data['bookingDate'],
            'guest_email' => $data['guestEmail'] ?? null,
            'source' => $data['source'] ?? 'web',
            'notes' => $data['notes'] ?? null,
            'status' => 'confirmed',
        ]);
        $this->sendBookingConfirmation($booking, $request->user());
        return response()->json(['success' => true, 'data' => $this->format($booking)], 201);
    }

    public function cancel(int $id): JsonResponse
    {
        $booking = Booking::find($id);
        if (!$booking) return response()->json(['success' => false, 'error' => 'Not found'], 404);
        $booking->update(['status' => 'cancelled', 'cancelled_at' => now()]);
        $booking->refresh();
        $this->sendCancellationConfirmation($booking);
        return response()->json(['success' => true, 'data' => $this->format($booking)]);
    }

    public function reschedule(Request $request, int $id): JsonResponse
    {
        $data = $request->validate(['date' => 'required|date']);
        $booking = Booking::find($id);
        if (!$booking) return response()->json(['success' => false, 'error' => 'Not found'], 404);
        $booking->update(['booking_date' => $data['date']]);
        $booking->refresh();
        return response()->json(['success' => true, 'data' => $this->format($booking)]);
    }

    private function sendBookingConfirmation(Booking $booking, User $user): void
    {
        $schedule = $booking->schedule;
        $classType = $schedule?->classType;
        $coach = $schedule?->coach_id ? Coach::find($schedule->coach_id) : null;
        $location = $schedule?->location_id ? Location::find($schedule->location_id) : null;

        Mail::to($user->email)->queue(new BookingConfirmationMail(
            userName: $user->first_name,
            date: $booking->booking_date?->format('Y-m-d') ?? '',
            time: $schedule?->start_time?->format('H:i') ?? '',
            location: $location?->name ?? '',
            instructor: $coach ? trim($coach->first_name . ' ' . $coach->last_name) : '',
            className: $classType?->name ?? '',
        ));
    }

    private function sendCancellationConfirmation(Booking $booking): void
    {
        $user = $booking->user_id ? User::find($booking->user_id) : null;
        if (!$user) return;

        $schedule = $booking->schedule;
        $classType = $schedule?->classType;

        Mail::to($user->email)->queue(new CancellationConfirmationMail(
            userName: $user->first_name,
            date: $booking->booking_date?->format('Y-m-d') ?? '',
            time: $schedule?->start_time?->format('H:i') ?? '',
            className: $classType?->name ?? '',
        ));
    }

    private function format(Booking $b): array
    {
        $arr = [];
        foreach ($b->getAttributes() as $key => $value) {
            $arr[Str::camel($key)] = $value;
        }
        $arr['createdAt'] = $b->created_at?->toISOString();
        $arr['updatedAt'] = $b->updated_at?->toISOString();
        return $arr;
    }
}
