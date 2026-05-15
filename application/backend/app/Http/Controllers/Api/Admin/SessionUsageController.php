<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerSubscription;
use App\Models\PointCardPurchase;
use App\Models\SubscriptionPlan;
use App\Models\PointCardPlan;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class SessionUsageController extends Controller
{
    public function index(): JsonResponse
    {
        $customers = User::where('role', 'customer')->get();

        return response()->json([
            'success' => true,
            'data' => $customers->map(function ($user) {
                $subscription = CustomerSubscription::where('user_id', $user->id)
                    ->whereIn('status', ['active', 'trialing'])
                    ->first();

                $pointCards = PointCardPurchase::where('user_id', $user->id)
                    ->where('sessions_remaining', '>', 0)
                    ->get();

                $subData = null;
                if ($subscription) {
                    $plan = SubscriptionPlan::find($subscription->subscription_plan_id);
                    $subData = [
                        'planName' => $plan?->name ?? 'Unknown',
                        'sessionsUsed' => (int) $subscription->sessions_used,
                        'sessionsLimit' => null,
                        'status' => $subscription->status,
                    ];
                }

                $cardData = $pointCards->map(function ($pc) {
                    $plan = PointCardPlan::find($pc->point_card_plan_id);
                    return [
                        'planName' => $plan?->name ?? 'Unknown',
                        'sessionsRemaining' => (int) $pc->sessions_remaining,
                        'totalSessions' => $plan?->sessions_count ?? 0,
                        'expiresAt' => $pc->expiry_date?->format('Y-m-d'),
                    ];
                });

                return [
                    'userId' => $user->id,
                    'customerName' => $user->first_name . ' ' . $user->last_name,
                    'subscription' => $subData,
                    'pointCards' => $cardData,
                ];
            }),
        ]);
    }
}
