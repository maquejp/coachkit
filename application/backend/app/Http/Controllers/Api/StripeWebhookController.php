<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerSubscription;
use App\Models\PaymentTransaction;
use App\Models\PointCardPlan;
use App\Models\User;
use App\Services\StripeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StripeWebhookController extends Controller
{
    public function __construct(
        private readonly StripeService $stripe,
    ) {}

    public function handleWebhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        if (!$sigHeader) {
            return response()->json(['error' => 'Missing signature'], 400);
        }

        try {
            $event = $this->stripe->constructWebhookEvent($payload, $sigHeader);
        } catch (\Exception $e) {
            Log::warning('Stripe webhook signature verification failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Invalid signature'], 400);
        }

        try {
            match ($event->type) {
                'payment_intent.succeeded' => $this->handlePaymentIntentSucceeded($event->data->object),
                'payment_intent.payment_failed' => $this->handlePaymentIntentFailed($event->data->object),
                'customer.subscription.updated' => $this->handleSubscriptionUpdated($event->data->object),
                'customer.subscription.deleted' => $this->handleSubscriptionDeleted($event->data->object),
                'customer.subscription.created' => $this->handleSubscriptionCreated($event->data->object),
                'invoice.paid' => $this->handleInvoicePaid($event->data->object),
                default => Log::info('Unhandled Stripe event type', ['type' => $event->type]),
            };
        } catch (\Exception $e) {
            Log::error('Stripe webhook handler failed', [
                'type' => $event->type,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['error' => 'Handler failed'], 500);
        }

        return response()->json(['received' => true]);
    }

    private function handlePaymentIntentSucceeded(object $paymentIntent): void
    {
        $userId = $paymentIntent->metadata->user_id ?? null;

        if (!$userId) {
            Log::warning('PaymentIntent succeeded with no user_id metadata', [
                'id' => $paymentIntent->id,
            ]);

            return;
        }

        $existing = PaymentTransaction::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if ($existing) {
            $existing->update(['status' => 'completed']);
            return;
        }

        $user = User::find($userId);

        if (!$user) {
            Log::warning('PaymentIntent succeeded for unknown user', [
                'user_id' => $userId,
                'payment_intent_id' => $paymentIntent->id,
            ]);

            return;
        }

        $metadata = $paymentIntent->metadata ?? [];
        $planType = $metadata['plan_type'] ?? null;
        $planId = isset($metadata['plan_id']) ? (int) $metadata['plan_id'] : null;

        DB::transaction(function () use ($user, $paymentIntent, $planType, $planId, $metadata) {
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
                'metadata' => json_decode(json_encode($metadata), true),
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
                $plan = PointCardPlan::find($planId);
                $purchase = $user->pointCardPurchases()->create([
                    'point_card_plan_id' => $planId,
                    'sessions_remaining' => $plan?->sessions_count ?? 0,
                    'purchase_date' => now(),
                    'expiry_date' => $plan?->validity_days ? now()->addDays($plan->validity_days) : null,
                ]);

                $attrs['point_card_purchase_id'] = $purchase->id;
            }

            PaymentTransaction::query()->create($attrs);
        });
    }

    private function handlePaymentIntentFailed(object $paymentIntent): void
    {
        $existing = PaymentTransaction::where('stripe_payment_intent_id', $paymentIntent->id)->first();

        if ($existing) {
            $existing->update(['status' => 'failed']);
        }
    }

    private function handleSubscriptionCreated(object $stripeSubscription): void
    {
        $this->syncSubscriptionFromStripe($stripeSubscription);
    }

    private function handleSubscriptionUpdated(object $stripeSubscription): void
    {
        $this->syncSubscriptionFromStripe($stripeSubscription);
    }

    private function handleSubscriptionDeleted(object $stripeSubscription): void
    {
        $local = CustomerSubscription::where('stripe_subscription_id', $stripeSubscription->id)->first();

        if ($local) {
            $local->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'auto_renew' => false,
            ]);
        }
    }

    private function handleInvoicePaid(object $invoice): void
    {
        $stripeSubscriptionId = $invoice->subscription;

        if (!$stripeSubscriptionId) {
            return;
        }

        $local = CustomerSubscription::where('stripe_subscription_id', $stripeSubscriptionId)->first();

        if ($local) {
            $local->update([
                'end_date' => now()->addMonth(),
                'status' => 'active',
            ]);
        }
    }

    private function syncSubscriptionFromStripe(object $stripeSubscription): void
    {
        $local = CustomerSubscription::where('stripe_subscription_id', $stripeSubscription->id)->first();

        if (!$local) {
            return;
        }

        $statusMap = [
            'active' => 'active',
            'past_due' => 'past_due',
            'canceled' => 'cancelled',
            'incomplete' => 'incomplete',
            'incomplete_expired' => 'expired',
            'trialing' => 'trial',
            'paused' => 'paused',
        ];

        $status = $statusMap[$stripeSubscription->status] ?? 'unknown';

        $local->update(['status' => $status]);
    }
}
