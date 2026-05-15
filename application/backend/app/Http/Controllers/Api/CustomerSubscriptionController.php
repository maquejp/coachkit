<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomerSubscriptionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CustomerSubscription::query();
        if ($userId = $request->query('userId')) {
            $query->where('user_id', $userId);
        }
        $subs = $query->get();

        return response()->json([
            'success' => true,
            'data' => $subs->map(fn ($s) => $this->formatItem($s)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'subscriptionPlanId' => 'required|integer|exists:subscription_plans,id',
            'startDate' => 'required|date',
            'endDate' => 'nullable|date',
            'sessionsUsed' => 'nullable|integer|min:0',
            'status' => 'nullable|string|max:20',
            'stripeSubscriptionId' => 'nullable|string|max:255',
            'autoRenew' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        $sub = CustomerSubscription::create([
            'user_id' => $validated['userId'],
            'subscription_plan_id' => $validated['subscriptionPlanId'],
            'start_date' => $validated['startDate'],
            'end_date' => $validated['endDate'] ?? null,
            'sessions_used' => $validated['sessionsUsed'] ?? 0,
            'status' => $validated['status'] ?? 'active',
            'stripe_subscription_id' => $validated['stripeSubscriptionId'] ?? null,
            'auto_renew' => $validated['autoRenew'] ?? true,
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json(['success' => true, 'data' => $this->formatItem($sub)], 201);
    }

    public function changePlan(Request $request, int $id): JsonResponse
    {
        $sub = CustomerSubscription::find($id);
        if (!$sub) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $validated = $request->validate([
            'planId' => 'required|integer|exists:subscription_plans,id',
        ]);

        $sub->update(['subscription_plan_id' => $validated['planId']]);
        $sub->refresh();

        return response()->json(['success' => true, 'data' => $this->formatItem($sub)]);
    }

    public function cancel(int $id): JsonResponse
    {
        $sub = CustomerSubscription::find($id);
        if (!$sub) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $sub->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
            'end_date' => now(),
        ]);
        $sub->refresh();

        return response()->json(['success' => true, 'data' => $this->formatItem($sub)]);
    }

    private function formatItem(CustomerSubscription $sub): array
    {
        return collect($sub->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
