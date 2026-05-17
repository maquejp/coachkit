<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coach;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CoachController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $pageSize = (int) $request->query('pageSize', 20);

        $paginator = Coach::query()->paginate($pageSize, ['*'], 'page', $page);

        return response()->json([
            "success" => true,
            "data" => [
                'items' => collect($paginator->items())->map(fn (Coach $coach) => $this->formatItem($coach))->toArray(),
                'total' => $paginator->total(),
                'totalPages' => $paginator->lastPage(),
                'page' => $paginator->currentPage(),
                'pageSize' => $paginator->perPage(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $coach = Coach::find($id);

        if (!$coach) {
            return response()->json([
                "success" => false,
                "error" => "Coach not found",
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($coach),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "first_name" => "required|string|max:255",
            "last_name" => "required|string|max:255",
            "bio" => "nullable|string",
            "photo_url" => "nullable|url|max:500",
            "email" => "nullable|email|max:255|unique:coaches,email",
            "phone" => "nullable|string|max:50",
            "is_active" => "sometimes|boolean",
        ]);

        $coach = Coach::create($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($coach),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $coach = Coach::find($id);

        if (!$coach) {
            return response()->json([
                "success" => false,
                "error" => "Coach not found",
            ], 404);
        }

        $validated = $request->validate([
            "first_name" => "sometimes|string|max:255",
            "last_name" => "sometimes|string|max:255",
            "bio" => "nullable|string",
            "photo_url" => "nullable|url|max:500",
            "email" => "sometimes|email|max:255|unique:coaches,email,{$id}",
            "phone" => "nullable|string|max:50",
            "is_active" => "sometimes|boolean",
        ]);

        $coach->update($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($coach),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $coach = Coach::find($id);

        if (!$coach) {
            return response()->json([
                "success" => false,
                "error" => "Coach not found",
            ], 404);
        }

        $coach->delete();

        return response()->json([
            "success" => true,
            "data" => null,
        ]);
    }

    private function formatItem(Coach $coach): array
    {
        return collect($coach->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
