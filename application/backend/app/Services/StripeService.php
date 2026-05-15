<?php

namespace App\Services;

use App\Models\PointCardPlan;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Stripe\Customer;
use Stripe\Exception\SignatureVerificationException;
use Stripe\PaymentIntent;
use Stripe\SetupIntent;
use Stripe\Stripe;
use Stripe\StripeClient;
use Stripe\Subscription;
use Stripe\Webhook;
use Stripe\Product;
use Stripe\Price;

class StripeService
{
    private StripeClient $client;

    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
        $this->client = new StripeClient(config('services.stripe.secret'));
    }

    public function createCustomer(User $user): Customer
    {
        if ($user->stripe_customer_id) {
            return $this->client->customers->retrieve($user->stripe_customer_id);
        }

        $customer = $this->client->customers->create([
            'email' => $user->email,
            'name' => trim($user->first_name . ' ' . $user->last_name),
            'phone' => $user->phone,
            'metadata' => [
                'user_id' => (string) $user->id,
            ],
        ]);

        $user->update(['stripe_customer_id' => $customer->id]);

        return $customer;
    }

    public function createSetupIntent(User $user): SetupIntent
    {
        $customer = $this->createCustomer($user);

        return $this->client->setupIntents->create([
            'customer' => $customer->id,
            'usage' => 'off_session',
        ]);
    }

    public function createPaymentIntent(
        int $amountCents,
        string $currency,
        User $user,
        array $metadata = [],
    ): PaymentIntent {
        $customer = $this->createCustomer($user);

        return $this->client->paymentIntents->create([
            'amount' => $amountCents,
            'currency' => strtolower($currency),
            'customer' => $customer->id,
            'metadata' => array_merge($metadata, [
                'user_id' => (string) $user->id,
            ]),
            'automatic_payment_methods' => ['enabled' => true],
        ]);
    }

    public function retrievePaymentIntent(string $id): PaymentIntent
    {
        return $this->client->paymentIntents->retrieve($id);
    }

    public function createSubscription(
        User $user,
        string $priceId,
        ?string $paymentMethodId = null,
    ): Subscription {
        $customer = $this->createCustomer($user);

        $params = [
            'customer' => $customer->id,
            'items' => [['price' => $priceId]],
            'payment_behavior' => 'default_incomplete',
            'expand' => ['latest_invoice.payment_intent'],
        ];

        if ($paymentMethodId) {
            $params['default_payment_method'] = $paymentMethodId;
            $params['off_session'] = true;
        }

        return $this->client->subscriptions->create($params);
    }

    public function cancelSubscription(string $stripeSubscriptionId): Subscription
    {
        return $this->client->subscriptions->cancel($stripeSubscriptionId, []);
    }

    public function syncProduct(SubscriptionPlan $plan): void
    {
        $productData = [
            'name' => $plan->name,
            'description' => $plan->description,
            'metadata' => [
                'plan_id' => (string) $plan->id,
                'plan_type' => 'subscription',
            ],
        ];

        if ($plan->stripe_price_id) {
            $price = $this->client->prices->retrieve($plan->stripe_price_id, ['expand' => ['product']]);
            $product = $price->product;

            $this->client->products->update($product->id, $productData);

            $this->client->prices->update($plan->stripe_price_id, [
                'metadata' => ['plan_id' => (string) $plan->id],
            ]);
        } else {
            $product = $this->client->products->create($productData);

            $price = $this->client->prices->create([
                'product' => $product->id,
                'unit_amount' => $plan->price_cents,
                'currency' => 'eur',
                'recurring' => [
                    'interval' => $plan->interval === 'yearly' ? 'year' : 'month',
                    'interval_count' => 1,
                ],
            ]);

            $plan->update(['stripe_price_id' => $price->id]);
        }

        if ($plan->isDirty()) {
            $plan->save();
        }
    }

    public function syncPointCardProduct(PointCardPlan $plan): void
    {
        $productData = [
            'name' => $plan->name,
            'description' => $plan->description,
            'metadata' => [
                'plan_id' => (string) $plan->id,
                'plan_type' => 'point_card',
            ],
        ];

        if ($plan->stripe_price_id) {
            $price = $this->client->prices->retrieve($plan->stripe_price_id, ['expand' => ['product']]);
            $product = $price->product;

            $this->client->products->update($product->id, $productData);
        } else {
            $product = $this->client->products->create($productData);

            $price = $this->client->prices->create([
                'product' => $product->id,
                'unit_amount' => $plan->price_cents,
                'currency' => 'eur',
            ]);

            $plan->update(['stripe_price_id' => $price->id]);
        }
    }

    public function constructWebhookEvent(string $payload, string $sigHeader): object
    {
        $endpointSecret = config('services.stripe.webhook.secret');

        return Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
    }
}
