<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PointCardPurchase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PointCardPurchaseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PointCardPurchase::query();
        if ($userId = $request->query('userId')) {
            $query->where('user_id', $userId);
        }
        $purchases = $query->get();

        return response()->json([
            'success' => true,
            'data' => $purchases->map(fn ($p) => $this->formatItem($p)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'pointCardPlanId' => 'required|integer|exists:point_card_plans,id',
            'sessionsRemaining' => 'nullable|integer|min:0',
            'purchaseDate' => 'nullable|date',
            'expiryDate' => 'nullable|date',
        ]);

        $purchase = PointCardPurchase::create([
            'user_id' => $validated['userId'],
            'point_card_plan_id' => $validated['pointCardPlanId'],
            'sessions_remaining' => $validated['sessionsRemaining'] ?? 0,
            'purchase_date' => $validated['purchaseDate'] ?? now(),
            'expiry_date' => $validated['expiryDate'] ?? null,
        ]);

        return response()->json(['success' => true, 'data' => $this->formatItem($purchase)], 201);
    }

    private function formatItem(PointCardPurchase $purchase): array
    {
        return collect($purchase->toArray())
            ->mapWithKeys(fn (mixed $value, string $key) => [Str::camel($key) => $value])
            ->toArray();
    }
}
