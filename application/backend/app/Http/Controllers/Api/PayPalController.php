<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentTransaction;
use App\Models\PointCardPlan;
use App\Models\SubscriptionPlan;
use App\Services\PayPalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PayPalController extends Controller
{
    public function __construct(
        private readonly PayPalService $paypal,
    ) {}

    public function createOrder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'planType' => 'required|string|in:subscription,point_card',
            'planId' => 'required|integer',
            'currency' => 'sometimes|string|size:3',
        ]);

        $user = $request->user();
        $currency = strtoupper($data['currency'] ?? 'EUR');

        if ($data['planType'] === 'subscription') {
            $plan = SubscriptionPlan::query()->findOrFail($data['planId']);
        } else {
            $plan = PointCardPlan::query()->findOrFail($data['planId']);
        }

        try {
            $order = $this->paypal->createOrder(
                amountCents: $plan->price_cents,
                currency: $currency,
                description: "{$plan->name} - {$data['planType']}",
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'orderId' => $order['id'],
                    'status' => $order['status'],
                    'approvalUrl' => collect($order['links'] ?? [])
                        ->firstWhere('rel', 'approve')['href'] ?? null,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('PayPal create order failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to create PayPal order.',
            ], 500);
        }
    }

    public function captureOrder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'orderId' => 'required|string',
            'planType' => 'required|string|in:subscription,point_card',
            'planId' => 'required|integer',
        ]);

        $user = $request->user();

        try {
            $captured = $this->paypal->captureOrder($data['orderId']);

            if (($captured['status'] ?? '') !== 'COMPLETED') {
                return response()->json([
                    'success' => false,
                    'error' => 'PayPal order was not completed.',
                ], 400);
            }

            $purchaseUnit = $captured['purchase_units'][0] ?? [];
            $capture = $purchaseUnit['payments']['captures'][0] ?? [];
            $paypalCaptureId = $capture['id'] ?? null;
            $amount = $capture['amount'] ?? [];
            $amountCents = (int) (($amount['value'] ?? 0) * 100);
            $currency = $amount['currency_code'] ?? 'EUR';

            $existing = PaymentTransaction::where('paypal_capture_id', $paypalCaptureId)->first();

            if ($existing) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'transactionId' => $existing->id,
                        'status' => $existing->status,
                    ],
                ]);
            }

            $planType = $data['planType'];
            $planId = $data['planId'];

            $transaction = DB::transaction(function () use (
                $user, $paypalCaptureId, $data, $amountCents, $currency, $planType, $planId,
            ) {
                $attrs = [
                    'user_id' => $user->id,
                    'amount_cents' => $amountCents,
                    'fee_cents' => 0,
                    'net_cents' => $amountCents,
                    'currency' => $currency,
                    'status' => 'completed',
                    'payment_method' => 'paypal',
                    'paypal_order_id' => $data['orderId'],
                    'paypal_capture_id' => $paypalCaptureId,
                    'description' => "PayPal {$planType} #{$planId}",
                ];

                if ($planType === 'subscription') {
                    $subscription = $user->subscriptions()->create([
                        'subscription_plan_id' => $planId,
                        'start_date' => now(),
                        'end_date' => now()->addMonth(),
                        'sessions_used' => 0,
                        'status' => 'active',
                        'auto_renew' => false,
                    ]);

                    $attrs['subscription_id'] = $subscription->id;
                } else {
                    $plan = PointCardPlan::find($planId);
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
        } catch (\Exception $e) {
            Log::error('PayPal capture failed', [
                'order_id' => $data['orderId'],
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to capture PayPal order.',
            ], 500);
        }
    }

    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $headers = [
            'paypal-auth-algo' => $request->header('PAYPAL-AUTH-ALGO', ''),
            'paypal-cert-url' => $request->header('PAYPAL-CERT-URL', ''),
            'paypal-transmission-id' => $request->header('PAYPAL-TRANSMISSION-ID', ''),
            'paypal-transmission-sig' => $request->header('PAYPAL-TRANSMISSION-SIG', ''),
            'paypal-transmission-time' => $request->header('PAYPAL-TRANSMISSION-TIME', ''),
        ];

        if (!$this->paypal->verifyWebhookSignature($payload, $headers)) {
            Log::warning('PayPal webhook signature verification failed');

            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $event = json_decode($payload, true);
        $eventType = $event['event_type'] ?? '';
        $resource = $event['resource'] ?? [];

        try {
            match ($eventType) {
                'PAYMENT.CAPTURE.COMPLETED' => $this->handleCaptureCompleted($resource),
                'CHECKOUT.ORDER.APPROVED' => $this->handleOrderApproved($resource),
                default => Log::info('Unhandled PayPal event type', ['type' => $eventType]),
            };
        } catch (\Exception $e) {
            Log::error('PayPal webhook handler failed', [
                'type' => $eventType,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Handler failed'], 500);
        }

        return response()->json(['received' => true]);
    }

    private function handleCaptureCompleted(array $resource): void
    {
        $captureId = $resource['id'] ?? null;

        if (!$captureId) {
            return;
        }

        $existing = PaymentTransaction::where('paypal_capture_id', $captureId)->first();

        if ($existing) {
            $existing->update(['status' => 'completed']);
        }
    }

    private function handleOrderApproved(array $resource): void
    {
        Log::info('PayPal order approved (awaiting capture)', [
            'order_id' => $resource['id'] ?? null,
        ]);
    }
}
