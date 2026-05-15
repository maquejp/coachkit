<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeeklySchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WeeklyScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = WeeklySchedule::query();

        if ($request->has("day")) {
            $query->where("day_of_week", $request->input("day"));
        }

        $schedules = $query->get();

        return response()->json([
            "success" => true,
            "data" => $schedules->map(fn (WeeklySchedule $schedule) => $this->formatItem($schedule)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $schedule = WeeklySchedule::find($id);

        if (!$schedule) {
            return response()->json([
                "success" => false,
                "error" => "Weekly schedule not found",
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($schedule),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "class_type_id" => "required|integer|exists:class_types,id",
            "coach_id" => "required|integer|exists:coaches,id",
            "location_id" => "required|integer|exists:locations,id",
            "day_of_week" => "required|integer|min:0|max:6",
            "start_time" => "required|string",
            "end_time" => "required|string|after:start_time",
            "max_capacity" => "nullable|integer|min:1",
            "valid_from" => "nullable|date",
            "valid_until" => "nullable|date|after_or_equal:valid_from",
            "is_active" => "sometimes|boolean",
        ]);

        $schedule = WeeklySchedule::create($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($schedule),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $schedule = WeeklySchedule::find($id);

        if (!$schedule) {
            return response()->json([
                "success" => false,
                "error" => "Weekly schedule not found",
            ], 404);
        }

        $validated = $request->validate([
            "class_type_id" => "sometimes|integer|exists:class_types,id",
            "coach_id" => "sometimes|integer|exists:coaches,id",
            "location_id" => "sometimes|integer|exists:locations,id",
            "day_of_week" => "sometimes|integer|min:0|max:6",
            "start_time" => "sometimes|string",
            "end_time" => "sometimes|string|after:start_time",
            "max_capacity" => "nullable|integer|min:1",
            "valid_from" => "nullable|date",
            "valid_until" => "nullable|date|after_or_equal:valid_from",
            "is_active" => "sometimes|boolean",
        ]);

        $schedule->update($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($schedule),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $schedule = WeeklySchedule::find($id);

        if (!$schedule) {
            return response()->json([
                "success" => false,
                "error" => "Weekly schedule not found",
            ], 404);
        }

        $schedule->delete();

        return response()->json([
            "success" => true,
            "data" => null,
        ]);
    }

    private function formatItem(WeeklySchedule $schedule): array
    {
        return collect($schedule->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
