<?php

namespace Tests\Feature;

use App\Models\PaymentTransaction;
use App\Models\PointCardPlan;
use App\Models\SubscriptionPlan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PayPalTest extends TestCase
{
    use RefreshDatabase;

    private User $customer;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'services.paypal.client_id' => 'test_client_id',
            'services.paypal.secret' => 'test_secret',
            'services.paypal.mode' => 'sandbox',
            'services.paypal.webhook_id' => 'test_webhook_id',
        ]);

        $this->customer = User::factory()->create();
        $this->token = $this->customer->createToken('test')->plainTextToken;
    }

    public function test_create_order_for_subscription(): void
    {
        $plan = SubscriptionPlan::query()->create([
            'name' => 'Monthly Unlimited',
            'price_cents' => 9900,
            'interval' => 'monthly',
        ]);

        $this->fakePayPalToken();
        $this->fakePayPalCreateOrder();

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/paypal/create-order', [
                'planType' => 'subscription',
                'planId' => $plan->id,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['orderId' => 'PAYPAL_ORDER_123'],
            ]);
    }

    public function test_create_order_for_point_card(): void
    {
        $plan = PointCardPlan::query()->create([
            'name' => '10 Session Card',
            'price_cents' => 49000,
            'sessions_count' => 10,
            'validity_days' => 180,
        ]);

        $this->fakePayPalToken();
        $this->fakePayPalCreateOrder();

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/paypal/create-order', [
                'planType' => 'point_card',
                'planId' => $plan->id,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['orderId' => 'PAYPAL_ORDER_123'],
            ]);
    }

    public function test_create_order_validates_plan_type(): void
    {
        $this->fakePayPalToken();

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/paypal/create-order', [
                'planType' => 'invalid',
                'planId' => 1,
            ]);

        $response->assertStatus(422);
    }

    public function test_capture_order_creates_subscription(): void
    {
        $plan = SubscriptionPlan::query()->create([
            'name' => 'Monthly Unlimited',
            'price_cents' => 9900,
            'interval' => 'monthly',
        ]);

        $this->fakePayPalToken();
        $this->fakePayPalCaptureOrder();

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/paypal/capture-order', [
                'orderId' => 'PAYPAL_ORDER_123',
                'planType' => 'subscription',
                'planId' => $plan->id,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => ['status' => 'completed'],
            ]);

        $this->assertDatabaseHas('payment_transactions', [
            'paypal_order_id' => 'PAYPAL_ORDER_123',
            'paypal_capture_id' => 'PAYPAL_CAPTURE_123',
            'amount_cents' => 9900,
            'payment_method' => 'paypal',
        ]);

        $this->assertDatabaseHas('customer_subscriptions', [
            'user_id' => $this->customer->id,
            'subscription_plan_id' => $plan->id,
            'status' => 'active',
        ]);
    }

    public function test_capture_order_creates_point_card_purchase(): void
    {
        $plan = PointCardPlan::query()->create([
            'name' => '5 Session Card',
            'price_cents' => 25000,
            'sessions_count' => 5,
            'validity_days' => 90,
        ]);

        $this->fakePayPalToken();
        $this->fakePayPalCaptureOrder();

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/paypal/capture-order', [
                'orderId' => 'PAYPAL_ORDER_250',
                'planType' => 'point_card',
                'planId' => $plan->id,
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => ['status' => 'completed'],
            ]);

        $this->assertDatabaseHas('payment_transactions', [
            'paypal_order_id' => 'PAYPAL_ORDER_250',
            'amount_cents' => 25000,
        ]);

        $this->assertDatabaseHas('point_card_purchases', [
            'user_id' => $this->customer->id,
            'point_card_plan_id' => $plan->id,
            'sessions_remaining' => 5,
        ]);
    }

    public function test_capture_order_is_idempotent(): void
    {
        SubscriptionPlan::query()->create([
            'name' => 'Monthly Unlimited',
            'price_cents' => 9900,
            'interval' => 'monthly',
        ]);

        PaymentTransaction::query()->create([
            'user_id' => $this->customer->id,
            'amount_cents' => 9900,
            'currency' => 'EUR',
            'status' => 'completed',
            'payment_method' => 'paypal',
            'paypal_order_id' => 'PAYPAL_ORDER_123',
            'paypal_capture_id' => 'PAYPAL_CAPTURE_123',
            'description' => 'Test',
        ]);

        $this->fakePayPalToken();
        $this->fakePayPalCaptureOrder();

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/paypal/capture-order', [
                'orderId' => 'PAYPAL_ORDER_123',
                'planType' => 'subscription',
                'planId' => 1,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['status' => 'completed'],
            ]);

        $this->assertDatabaseCount('payment_transactions', 1);
    }

    public function test_create_order_requires_auth(): void
    {
        $response = $this->postJson('/api/payments/paypal/create-order', [
            'planType' => 'subscription',
            'planId' => 1,
        ]);

        $response->assertStatus(401);
    }

    public function test_capture_order_requires_auth(): void
    {
        $response = $this->postJson('/api/payments/paypal/capture-order', [
            'orderId' => 'ORDER_123',
            'planType' => 'subscription',
            'planId' => 1,
        ]);

        $response->assertStatus(401);
    }

    private function fakePayPalToken(): void
    {
        Http::fake([
            '*/v1/oauth2/token' => Http::response([
                'access_token' => 'fake_paypal_token',
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ], 200),
        ]);
    }

    private function fakePayPalCreateOrder(): void
    {
        Http::fake([
            '*/v2/checkout/orders' => Http::sequence()
                ->push([
                    'id' => 'PAYPAL_ORDER_123',
                    'status' => 'CREATED',
                    'links' => [
                        ['rel' => 'approve', 'href' => 'https://paypal.com/checkout/APPROVE_123'],
                        ['rel' => 'self', 'href' => 'https://api.paypal.com/v2/checkout/orders/PAYPAL_ORDER_123'],
                    ],
                ], 200),
        ]);
    }

    private function fakePayPalCaptureOrder(): void
    {
        Http::fake([
            '*/v2/checkout/orders/*/capture' => function (\Illuminate\Http\Client\Request $request) {
                $url = (string) $request->url();
                preg_match('/\/orders\/([^\/]+)\/capture/', $url, $matches);
                $orderId = $matches[1] ?? 'PAYPAL_ORDER_123';

                $captureValue = $orderId === 'PAYPAL_ORDER_250' ? '250.00' : '99.00';

                return Http::response([
                    'id' => $orderId,
                    'status' => 'COMPLETED',
                    'purchase_units' => [
                        [
                            'payments' => [
                                'captures' => [
                                    [
                                        'id' => 'PAYPAL_CAPTURE_' . substr($orderId, -3),
                                        'amount' => [
                                            'value' => $captureValue,
                                            'currency_code' => 'EUR',
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ], 200);
            },
        ]);
    }
}
