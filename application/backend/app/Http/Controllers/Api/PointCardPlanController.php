<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PointCardPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PointCardPlanController extends Controller
{
    public function index(): JsonResponse
    {
        $plans = PointCardPlan::all();

        return response()->json([
            'success' => true,
            'data' => $plans->map(fn ($p) => $this->formatItem($p)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $plan = PointCardPlan::find($id);
        if (!$plan) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $this->formatItem($plan)]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'sessionsCount' => 'required|integer|min:1',
            'priceCents' => 'required|integer|min:0',
            'validityDays' => 'required|integer|min:1',
            'isActive' => 'nullable|boolean',
            'stripePriceId' => 'nullable|string|max:255',
        ]);

        $plan = PointCardPlan::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'sessions_count' => $validated['sessionsCount'],
            'price_cents' => $validated['priceCents'],
            'validity_days' => $validated['validityDays'],
            'is_active' => $validated['isActive'] ?? true,
            'stripe_price_id' => $validated['stripePriceId'] ?? null,
        ]);

        return response()->json(['success' => true, 'data' => $this->formatItem($plan)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $plan = PointCardPlan::find($id);
        if (!$plan) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'sessionsCount' => 'sometimes|integer|min:1',
            'priceCents' => 'sometimes|integer|min:0',
            'validityDays' => 'sometimes|integer|min:1',
            'isActive' => 'nullable|boolean',
            'stripePriceId' => 'nullable|string|max:255',
        ]);

        $data = [];
        if (isset($validated['name'])) $data['name'] = $validated['name'];
        if (array_key_exists('description', $validated)) $data['description'] = $validated['description'];
        if (isset($validated['sessionsCount'])) $data['sessions_count'] = $validated['sessionsCount'];
        if (isset($validated['priceCents'])) $data['price_cents'] = $validated['priceCents'];
        if (isset($validated['validityDays'])) $data['validity_days'] = $validated['validityDays'];
        if (array_key_exists('isActive', $validated)) $data['is_active'] = $validated['isActive'];
        if (array_key_exists('stripePriceId', $validated)) $data['stripe_price_id'] = $validated['stripePriceId'];

        $plan->update($data);
        $plan->refresh();

        return response()->json(['success' => true, 'data' => $this->formatItem($plan)]);
    }

    public function destroy(int $id): JsonResponse
    {
        $plan = PointCardPlan::find($id);
        if (!$plan) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $plan->delete();

        return response()->json(['success' => true, 'data' => null]);
    }

    private function formatItem(PointCardPlan $plan): array
    {
        return collect($plan->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
