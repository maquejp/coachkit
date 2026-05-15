<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Mail\WaitlistPromotionMail;
use App\Models\ClassType;
use App\Models\User;
use App\Models\WaitlistEntry;
use App\Models\WeeklySchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class WaitlistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = WaitlistEntry::query();

        if ($scheduleId = $request->query('scheduleId')) {
            $query->where('schedule_id', $scheduleId);
        }
        if ($date = $request->query('date')) {
            $query->where('date', $date);
        }

        $entries = $query->get();

        $userIds = $entries->pluck('user_id')->unique()->values()->all();
        $users = User::whereIn('id', $userIds)->get()->keyBy('id');

        $scheduleIds = $entries->pluck('schedule_id')->unique()->values()->all();
        $schedules = WeeklySchedule::whereIn('id', $scheduleIds)->get()->keyBy('id');
        $classTypeIds = $schedules->pluck('class_type_id')->unique()->values()->all();
        $classTypes = ClassType::whereIn('id', $classTypeIds)->get()->keyBy('id');

        $enriched = $entries->map(function ($entry) use ($users, $schedules, $classTypes) {
            $user = $users->get($entry->user_id);
            $schedule = $schedules->get($entry->schedule_id);
            $classType = $schedule ? $classTypes->get($schedule->class_type_id) : null;

            return [
                'id' => $entry->id,
                'userId' => $entry->user_id,
                'scheduleId' => $entry->schedule_id,
                'date' => $entry->date?->format('Y-m-d'),
                'position' => null,
                'status' => $entry->status,
                'customerName' => $user ? $user->first_name . ' ' . $user->last_name : 'Unknown',
                'className' => $classType?->name ?? 'Unknown',
                'classColor' => $classType?->color ?? '#ccc',
                'createdAt' => $entry->created_at,
            ];
        });

        return response()->json(['success' => true, 'data' => $enriched]);
    }

    public function promote(int $id): JsonResponse
    {
        $entry = WaitlistEntry::find($id);
        if (!$entry) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $entry->update(['status' => 'promoted']);
        $entry->refresh();

        $user = User::find($entry->user_id);
        $this->sendWaitlistPromotion($entry);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $entry->id,
                'userId' => $entry->user_id,
                'scheduleId' => $entry->schedule_id,
                'date' => $entry->date?->format('Y-m-d'),
                'position' => null,
                'status' => $entry->status,
                'customerName' => $user ? $user->first_name . ' ' . $user->last_name : 'Unknown',
                'className' => 'Unknown',
                'classColor' => '#ccc',
                'createdAt' => $entry->created_at,
            ],
        ]);
    }

    public function remove(int $id): JsonResponse
    {
        $entry = WaitlistEntry::find($id);
        if (!$entry) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $entry->delete();

        return response()->json(['success' => true, 'data' => null]);
    }

    public function notifyAll(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'scheduleId' => 'required|integer|exists:weekly_schedule,id',
            'date' => 'required|date',
        ]);

        $toNotify = WaitlistEntry::where('schedule_id', $validated['scheduleId'])
            ->where('date', $validated['date'])
            ->where('status', 'waiting')
            ->count();

        WaitlistEntry::where('schedule_id', $validated['scheduleId'])
            ->where('date', $validated['date'])
            ->where('status', 'waiting')
            ->update(['notified_at' => now()]);

        $entries = WaitlistEntry::with('schedule.classType')
            ->where('schedule_id', $validated['scheduleId'])
            ->where('date', $validated['date'])
            ->where('status', 'waiting')
            ->get();

        $schedule = $entries->first()?->schedule;

        foreach ($entries as $entry) {
            $user = User::find($entry->user_id);
            if (!$user) continue;

            Mail::to($user->email)->queue(new WaitlistPromotionMail(
                userName: $user->first_name,
                className: $schedule?->classType?->name ?? '',
                date: $entry->date?->format('Y-m-d') ?? '',
                time: $schedule?->start_time?->format('H:i') ?? '',
                claimExpiryHours: 24,
            ));
        }

        return response()->json([
            'success' => true,
            'data' => [
                'notified' => $toNotify,
                'message' => "{$toNotify} customer(s) notified.",
            ],
        ]);
    }

    private function sendWaitlistPromotion(WaitlistEntry $entry): void
    {
        $user = User::find($entry->user_id);
        if (!$user) return;

        $schedule = WeeklySchedule::with('classType')->find($entry->schedule_id);
        if (!$schedule) return;

        Mail::to($user->email)->queue(new WaitlistPromotionMail(
            userName: $user->first_name,
            className: $schedule->classType?->name ?? '',
            date: $entry->date?->format('Y-m-d') ?? '',
            time: $schedule->start_time?->format('H:i') ?? '',
            claimExpiryHours: 24,
        ));
    }
}
