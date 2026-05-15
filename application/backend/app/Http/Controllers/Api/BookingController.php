<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            'userId' => 'nullable|integer|exists:users,id',
            'scheduleId' => 'required|integer|exists:weekly_schedule,id',
            'bookingDate' => 'required|date',
            'guestEmail' => 'nullable|email',
            'source' => 'nullable|string|max:20',
            'notes' => 'nullable|string',
        ]);
        $booking = Booking::query()->create([
            'user_id' => $data['userId'] ?? null,
            'schedule_id' => $data['scheduleId'],
            'booking_date' => $data['bookingDate'],
            'guest_email' => $data['guestEmail'] ?? null,
            'source' => $data['source'] ?? 'web',
            'notes' => $data['notes'] ?? null,
            'status' => 'confirmed',
        ]);
        return response()->json(['success' => true, 'data' => $this->format($booking)], 201);
    }

    public function cancel(int $id): JsonResponse
    {
        $booking = Booking::find($id);
        if (!$booking) return response()->json(['success' => false, 'error' => 'Not found'], 404);
        $booking->update(['status' => 'cancelled', 'cancelled_at' => now()]);
        $booking->refresh();
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
