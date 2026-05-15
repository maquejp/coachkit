<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class LocationController extends Controller
{
    public function index(): JsonResponse
    {
        $locations = Location::all();

        return response()->json([
            "success" => true,
            "data" => $locations->map(fn (Location $location) => $this->formatItem($location)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                "success" => false,
                "error" => "Location not found",
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($location),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "slug" => "required|string|max:255|unique:locations,slug",
            "address" => "nullable|string",
            "city" => "nullable|string|max:255",
            "postal_code" => "nullable|string|max:20",
            "phone" => "nullable|string|max:50",
            "email" => "nullable|email|max:255",
            "google_maps_url" => "nullable|url|max:500",
            "notes" => "nullable|string",
            "is_active" => "sometimes|boolean",
        ]);

        $location = Location::create($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($location),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                "success" => false,
                "error" => "Location not found",
            ], 404);
        }

        $validated = $request->validate([
            "name" => "sometimes|string|max:255",
            "slug" => "sometimes|string|max:255|unique:locations,slug,{$id}",
            "address" => "nullable|string",
            "city" => "nullable|string|max:255",
            "postal_code" => "nullable|string|max:20",
            "phone" => "nullable|string|max:50",
            "email" => "nullable|email|max:255",
            "google_maps_url" => "nullable|url|max:500",
            "notes" => "nullable|string",
            "is_active" => "sometimes|boolean",
        ]);

        $location->update($validated);

        return response()->json([
            "success" => true,
            "data" => $this->formatItem($location),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                "success" => false,
                "error" => "Location not found",
            ], 404);
        }

        $location->delete();

        return response()->json([
            "success" => true,
            "data" => null,
        ]);
    }

    private function formatItem(Location $location): array
    {
        return collect($location->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
