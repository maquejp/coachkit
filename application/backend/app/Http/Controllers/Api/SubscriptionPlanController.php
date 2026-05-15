<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionPlan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SubscriptionPlanController extends Controller
{
    public function index(): JsonResponse
    {
        $plans = SubscriptionPlan::all();

        return response()->json([
            'success' => true,
            'data' => $plans->map(fn ($p) => $this->formatItem($p)),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $plan = SubscriptionPlan::find($id);
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
            'type' => 'nullable|string|max:20',
            'sessionsPerWeek' => 'nullable|integer|min:0',
            'priceCents' => 'required|integer|min:0',
            'interval' => 'nullable|string|max:20',
            'commitmentMonths' => 'nullable|integer|min:0',
            'insuranceFeeCents' => 'nullable|integer|min:0',
            'trialDays' => 'nullable|integer|min:0',
            'isActive' => 'nullable|boolean',
            'stripePriceId' => 'nullable|string|max:255',
            'features' => 'nullable|array',
        ]);

        $plan = SubscriptionPlan::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'] ?? 'sessions',
            'sessions_per_week' => $validated['sessionsPerWeek'] ?? null,
            'price_cents' => $validated['priceCents'],
            'interval' => $validated['interval'] ?? 'monthly',
            'commitment_months' => $validated['commitmentMonths'] ?? null,
            'insurance_fee_cents' => $validated['insuranceFeeCents'] ?? 0,
            'trial_days' => $validated['trialDays'] ?? 0,
            'is_active' => $validated['isActive'] ?? true,
            'stripe_price_id' => $validated['stripePriceId'] ?? null,
            'features' => $validated['features'] ?? null,
        ]);

        return response()->json(['success' => true, 'data' => $this->formatItem($plan)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $plan = SubscriptionPlan::find($id);
        if (!$plan) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|string|max:20',
            'sessionsPerWeek' => 'nullable|integer|min:0',
            'priceCents' => 'sometimes|integer|min:0',
            'interval' => 'sometimes|string|max:20',
            'commitmentMonths' => 'nullable|integer|min:0',
            'insuranceFeeCents' => 'nullable|integer|min:0',
            'trialDays' => 'nullable|integer|min:0',
            'isActive' => 'nullable|boolean',
            'stripePriceId' => 'nullable|string|max:255',
            'features' => 'nullable|array',
        ]);

        $data = [];
        if (isset($validated['name'])) $data['name'] = $validated['name'];
        if (array_key_exists('description', $validated)) $data['description'] = $validated['description'];
        if (isset($validated['type'])) $data['type'] = $validated['type'];
        if (array_key_exists('sessionsPerWeek', $validated)) $data['sessions_per_week'] = $validated['sessionsPerWeek'];
        if (isset($validated['priceCents'])) $data['price_cents'] = $validated['priceCents'];
        if (isset($validated['interval'])) $data['interval'] = $validated['interval'];
        if (array_key_exists('commitmentMonths', $validated)) $data['commitment_months'] = $validated['commitmentMonths'];
        if (array_key_exists('insuranceFeeCents', $validated)) $data['insurance_fee_cents'] = $validated['insuranceFeeCents'];
        if (array_key_exists('trialDays', $validated)) $data['trial_days'] = $validated['trialDays'];
        if (array_key_exists('isActive', $validated)) $data['is_active'] = $validated['isActive'];
        if (array_key_exists('stripePriceId', $validated)) $data['stripe_price_id'] = $validated['stripePriceId'];
        if (array_key_exists('features', $validated)) $data['features'] = $validated['features'];

        $plan->update($data);
        $plan->refresh();

        return response()->json(['success' => true, 'data' => $this->formatItem($plan)]);
    }

    public function destroy(int $id): JsonResponse
    {
        $plan = SubscriptionPlan::find($id);
        if (!$plan) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $plan->delete();

        return response()->json(['success' => true, 'data' => null]);
    }

    private function formatItem(SubscriptionPlan $plan): array
    {
        return collect($plan->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
