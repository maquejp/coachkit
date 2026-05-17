<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ClassTypeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $page = (int) $request->query('page', 1);
        $pageSize = (int) $request->query('pageSize', 20);

        $paginator = ClassType::query()->paginate($pageSize, ['*'], 'page', $page);

        return response()->json([
            "success" => true,
            "data" => [
                'items' => collect($paginator->items())->map(fn (ClassType $classType) => $this->formatItem($classType))->toArray(),
                'total' => $paginator->total(),
                'totalPages' => $paginator->lastPage(),
                'page' => $paginator->currentPage(),
                'pageSize' => $paginator->perPage(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $classType = ClassType::find($id);

        if (!$classType) {
            return response()->json([
                "success" => false,
                "error" => "Class type not found",
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($classType),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "slug" => "required|string|max:255|unique:class_types,slug",
            "description" => "nullable|string",
            "color" => "nullable|string|max:20",
            "intensity_level" => "nullable|string|max:50",
            "image_url" => "nullable|url|max:500",
            "duration_minutes" => "nullable|integer|min:1",
            "max_capacity" => "nullable|integer|min:1",
            "default_price_cents" => "nullable|integer|min:0",
            "sort_order" => "nullable|integer",
            "is_active" => "sometimes|boolean",
        ]);

        $classType = ClassType::create($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($classType),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $classType = ClassType::find($id);

        if (!$classType) {
            return response()->json([
                "success" => false,
                "error" => "Class type not found",
            ], 404);
        }

        $validated = $request->validate([
            "name" => "sometimes|string|max:255",
            "slug" => "sometimes|string|max:255|unique:class_types,slug,{$id}",
            "description" => "nullable|string",
            "color" => "nullable|string|max:20",
            "intensity_level" => "nullable|string|max:50",
            "image_url" => "nullable|url|max:500",
            "duration_minutes" => "nullable|integer|min:1",
            "max_capacity" => "nullable|integer|min:1",
            "default_price_cents" => "nullable|integer|min:0",
            "sort_order" => "nullable|integer",
            "is_active" => "sometimes|boolean",
        ]);

        $classType->update($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($classType),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $classType = ClassType::find($id);

        if (!$classType) {
            return response()->json([
                "success" => false,
                "error" => "Class type not found",
            ], 404);
        }

        $classType->delete();

        return response()->json([
            "success" => true,
            "data" => null,
        ]);
    }

    private function formatItem(ClassType $classType): array
    {
        return collect($classType->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
