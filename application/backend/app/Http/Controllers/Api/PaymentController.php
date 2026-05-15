<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentTransaction;
use App\Models\PointCardPlan;
use App\Models\SubscriptionPlan;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    public function __construct(
        private readonly StripeService $stripe,
    ) {}

    public function createSetupIntent(Request $request): JsonResponse
    {
        try {
            $setupIntent = $this->stripe->createSetupIntent($request->user());

            return response()->json([
                'success' => true,
                'data' => [
                    'clientSecret' => $setupIntent->client_secret,
                ],
            ]);
        } catch (ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function createPaymentIntent(Request $request): JsonResponse
    {
        $data = $request->validate([
            'planType' => 'required|string|in:subscription,point_card',
            'planId' => 'required|integer',
            'currency' => 'sometimes|string|size:3',
        ]);

        $user = $request->user();
        $currency = strtoupper($data['currency'] ?? 'EUR');

        try {
            if ($data['planType'] === 'subscription') {
                $plan = SubscriptionPlan::query()->findOrFail($data['planId']);

                $paymentIntent = $this->stripe->createPaymentIntent(
                    amountCents: $plan->price_cents,
                    currency: $currency,
                    user: $user,
                    metadata: [
                        'plan_type' => 'subscription',
                        'plan_id' => (string) $plan->id,
                        'plan_name' => $plan->name,
                    ],
                );
            } else {
                $plan = PointCardPlan::query()->findOrFail($data['planId']);

                $paymentIntent = $this->stripe->createPaymentIntent(
                    amountCents: $plan->price_cents,
                    currency: $currency,
                    user: $user,
                    metadata: [
                        'plan_type' => 'point_card',
                        'plan_id' => (string) $plan->id,
                        'plan_name' => $plan->name,
                    ],
                );
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'clientSecret' => $paymentIntent->client_secret,
                    'paymentIntentId' => $paymentIntent->id,
                ],
            ]);
        } catch (ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function confirmPayment(Request $request): JsonResponse
    {
        $data = $request->validate([
            'paymentIntentId' => 'required|string',
        ]);

        $user = $request->user();

        try {
            $paymentIntent = $this->stripe->retrievePaymentIntent($data['paymentIntentId']);

            if ($paymentIntent->status !== 'succeeded') {
                return response()->json([
                    'success' => false,
                    'error' => 'Payment has not succeeded yet.',
                ], 400);
            }

            $existing = PaymentTransaction::where('stripe_payment_intent_id', $paymentIntent->id)->first();

            if ($existing) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'transactionId' => $existing->id,
                        'status' => $existing->status,
                    ],
                ]);
            }

            $piMetadata = $paymentIntent->metadata;
            $planType = $piMetadata instanceof \Stripe\StripeObject ? $piMetadata['plan_type'] ?? null : null;
            $planId = $piMetadata instanceof \Stripe\StripeObject && isset($piMetadata['plan_id']) ? (int) $piMetadata['plan_id'] : null;

            $transaction = DB::transaction(function () use ($user, $paymentIntent, $planType, $planId) {
                $metadata = $paymentIntent->metadata?->toArray() ?? [];

                $attrs = [
                    'user_id' => $user->id,
                    'amount_cents' => $paymentIntent->amount,
                    'fee_cents' => 0,
                    'net_cents' => $paymentIntent->amount,
                    'currency' => strtoupper($paymentIntent->currency),
                    'status' => 'completed',
                    'payment_method' => 'stripe',
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'receipt_url' => $paymentIntent->charges->data[0]->receipt_url ?? null,
                    'description' => $metadata['plan_name'] ?? 'Payment',
                    'metadata' => $metadata,
                ];

                if ($planType === 'subscription' && $planId) {
                    $subscription = $user->subscriptions()->create([
                        'subscription_plan_id' => $planId,
                        'start_date' => now(),
                        'end_date' => now()->addMonth(),
                        'sessions_used' => 0,
                        'status' => 'active',
                        'auto_renew' => true,
                    ]);

                    $attrs['subscription_id'] = $subscription->id;
                } elseif ($planType === 'point_card' && $planId) {
                    $plan = PointCardPlan::query()->find($planId);
                    $purchase = $user->pointCardPurchases()->create([
                        'point_card_plan_id' => $planId,
                        'sessions_remaining' => $plan?->sessions_count ?? 0,
                        'purchase_date' => now(),
                        'expiry_date' => $plan?->validity_days ? now()->addDays($plan->validity_days) : null,
                    ]);

                    $attrs['point_card_purchase_id'] = $purchase->id;
                }

                return PaymentTransaction::query()->create($attrs);
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'transactionId' => $transaction->id,
                    'status' => $transaction->status,
                ],
            ], 201);
        } catch (ApiErrorException $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function history(Request $request): JsonResponse
    {
        $transactions = $request->user()
            ->paymentTransactions()
            ->latest()
            ->get()
            ->map(fn (PaymentTransaction $t) => [
                'id' => $t->id,
                'amountCents' => $t->amount_cents,
                'currency' => $t->currency,
                'status' => $t->status,
                'paymentMethod' => $t->payment_method,
                'description' => $t->description,
                'receiptUrl' => $t->receipt_url,
                'createdAt' => $t->created_at,
            ]);

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }
}
