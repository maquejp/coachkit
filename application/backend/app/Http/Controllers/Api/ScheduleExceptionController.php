<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ScheduleException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ScheduleExceptionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ScheduleException::query();

        if ($request->has("locationId")) {
            $query->where("location_id", $request->input("locationId"));
        }

        $exceptions = $query->get();

        return response()->json([
            "success" => true,
            "data" => $exceptions->map(fn (ScheduleException $exception) => $this->formatItem($exception)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $exception = ScheduleException::find($id);

        if (!$exception) {
            return response()->json([
                "success" => false,
                "error" => "Schedule exception not found",
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($exception),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "location_id" => "required|integer|exists:locations,id",
            "date" => "required|date",
            "is_closed" => "sometimes|boolean",
            "open_time" => "nullable|string",
            "close_time" => "nullable|string|after:open_time",
            "reason" => "nullable|string|max:500",
        ]);

        $exception = ScheduleException::create($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($exception),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $exception = ScheduleException::find($id);

        if (!$exception) {
            return response()->json([
                "success" => false,
                "error" => "Schedule exception not found",
            ], 404);
        }

        $validated = $request->validate([
            "location_id" => "sometimes|integer|exists:locations,id",
            "date" => "sometimes|date",
            "is_closed" => "sometimes|boolean",
            "open_time" => "nullable|string",
            "close_time" => "nullable|string|after:open_time",
            "reason" => "nullable|string|max:500",
        ]);

        $exception->update($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($exception),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $exception = ScheduleException::find($id);

        if (!$exception) {
            return response()->json([
                "success" => false,
                "error" => "Schedule exception not found",
            ], 404);
        }

        $exception->delete();

        return response()->json([
            "success" => true,
            "data" => null,
        ]);
    }

    private function formatItem(ScheduleException $exception): array
    {
        return collect($exception->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
