<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Booking;
use App\Models\User;
use App\Models\WeeklySchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InstructorController extends Controller
{
    public function schedule(Request $request): JsonResponse
    {
        $coachId = $request->query('coachId');

        if (!$coachId) {
            return response()->json(['success' => false, 'error' => 'Missing coachId'], 400);
        }

        $schedules = WeeklySchedule::where('coach_id', $coachId)
            ->where('is_active', true)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules->map(fn ($s) => $this->camelize($s->toArray())),
        ]);
    }

    public function upcoming(Request $request): JsonResponse
    {
        $coachId = $request->query('coachId');

        if (!$coachId) {
            return response()->json(['success' => false, 'error' => 'Missing coachId'], 400);
        }

        $scheduleIds = WeeklySchedule::where('coach_id', $coachId)
            ->pluck('id');

        $bookings = Booking::whereIn('schedule_id', $scheduleIds)
            ->where('booking_date', '>=', now()->format('Y-m-d'))
            ->orderBy('booking_date')
            ->limit(10)
            ->get();

        $userIds = $bookings->pluck('user_id')->filter()->unique()->values()->all();
        $users = User::whereIn('id', $userIds)->get()->keyBy('id');

        return response()->json([
            'success' => true,
            'data' => $bookings->map(function ($b) use ($users) {
                $item = [
                    'id' => $b->id,
                    'userId' => $b->user_id,
                    'guestEmail' => $b->guest_email,
                    'bookingDate' => $b->booking_date,
                    'status' => $b->status,
                ];

                if ($b->user_id && $users->has($b->user_id)) {
                    $user = $users->get($b->user_id);
                    $item['user'] = [
                        'firstName' => $user->first_name,
                        'lastName' => $user->last_name,
                        'email' => $user->email,
                    ];
                } else {
                    $item['user'] = null;
                }

                return $item;
            }),
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $coachId = $request->query('coachId');

        if (!$coachId) {
            return response()->json(['success' => false, 'error' => 'Missing coachId'], 400);
        }

        $scheduleIds = WeeklySchedule::where('coach_id', $coachId)->pluck('id');

        $upcomingClasses = Booking::whereIn('schedule_id', $scheduleIds)
            ->where('booking_date', '>=', now()->format('Y-m-d'))
            ->where('status', 'confirmed')
            ->count();

        $totalStudents = Booking::whereIn('schedule_id', $scheduleIds)
            ->whereNotNull('user_id')
            ->distinct('user_id')
            ->count('user_id');

        $currentDayOfWeek = now()->dayOfWeek;
        $classesThisWeek = WeeklySchedule::where('coach_id', $coachId)
            ->where('day_of_week', $currentDayOfWeek)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'upcomingClasses' => $upcomingClasses,
                'totalStudents' => $totalStudents,
                'classesThisWeek' => $classesThisWeek,
            ],
        ]);
    }

    public function attendance(Request $request): JsonResponse
    {
        $scheduleId = $request->query('scheduleId');
        $date = $request->query('date');

        if (!$scheduleId || !$date) {
            return response()->json(['success' => false, 'error' => 'Missing scheduleId or date'], 400);
        }

        $schedule = WeeklySchedule::find($scheduleId);

        if (!$schedule) {
            return response()->json(['success' => false, 'error' => 'Schedule not found'], 404);
        }

        $bookings = Booking::where('schedule_id', $scheduleId)
            ->where('booking_date', $date)
            ->get();

        $userIds = $bookings->pluck('user_id')->filter()->unique()->values()->all();
        $users = User::whereIn('id', $userIds)->get()->keyBy('id');

        return response()->json([
            'success' => true,
            'data' => $bookings->map(function ($b) use ($users) {
                $item = [
                    'id' => $b->id,
                    'userId' => $b->user_id,
                    'guestEmail' => $b->guest_email,
                    'bookingDate' => $b->booking_date,
                    'status' => $b->status,
                ];

                if ($b->user_id && $users->has($b->user_id)) {
                    $user = $users->get($b->user_id);
                    $item['user'] = [
                        'firstName' => $user->first_name,
                        'lastName' => $user->last_name,
                        'email' => $user->email,
                    ];
                } else {
                    $item['user'] = null;
                }

                return $item;
            }),
        ]);
    }

    private function camelize(array $data): array
    {
        return collect($data)->mapWithKeys(fn ($value, $key) => [Str::camel($key) => $value])->toArray();
    }
}
