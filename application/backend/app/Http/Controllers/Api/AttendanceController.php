<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttendanceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $pageSize = (int) $request->query('pageSize', 20);

        $paginator = Attendance::query()->paginate($pageSize, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => [
                'items' => collect($paginator->items())->map(fn (Attendance $attendance) => $this->formatItem($attendance))->toArray(),
                'total' => $paginator->total(),
                'totalPages' => $paginator->lastPage(),
                'page' => $paginator->currentPage(),
                'pageSize' => $paginator->perPage(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "booking_id" => "nullable|integer|exists:bookings,id",
            "user_id" => "required|integer|exists:users,id",
            "class_type_id" => "required|integer|exists:class_types,id",
            "attended_at" => "required|date",
            "marked_by" => "nullable|integer|exists:users,id",
            "check_in_method" => "nullable|string|max:50",
            "notes" => "nullable|string",
        ]);

        $attendance = Attendance::create($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($attendance),
        ], 201);
    }

    private function formatItem(Attendance $attendance): array
    {
        return collect($attendance->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
