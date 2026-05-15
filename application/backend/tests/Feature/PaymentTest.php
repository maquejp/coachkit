<?php

namespace Tests\Feature;

use App\Models\PaymentTransaction;
use App\Models\PointCardPlan;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Services\StripeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Stripe\PaymentIntent;
use Stripe\SetupIntent;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $customer;
    private string $token;
    private MockInterface $stripeMock;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::factory()->create();
        $this->token = $this->customer->createToken('test')->plainTextToken;

        $this->stripeMock = $this->mock(StripeService::class);
    }

    private function makeSetupIntent(string $clientSecret): SetupIntent
    {
        return SetupIntent::constructFrom([
            'id' => $clientSecret,
            'client_secret' => $clientSecret,
        ]);
    }

    private function makePaymentIntent(array $props): PaymentIntent
    {
        $metadata = [];
        foreach (($props['metadata'] ?? []) as $k => $v) {
            $metadata[$k] = $v;
        }

        $charges = [];
        foreach (($props['charges'] ?? []) as $c) {
            $charges[] = $c;
        }

        return PaymentIntent::constructFrom([
            'id' => $props['id'] ?? 'pi_test',
            'status' => $props['status'] ?? 'succeeded',
            'amount' => $props['amount'] ?? 0,
            'currency' => $props['currency'] ?? 'eur',
            'client_secret' => 'secret_' . ($props['id'] ?? 'pi_test'),
            'charges' => ['data' => $charges],
            'metadata' => $metadata,
        ]);
    }

    public function test_create_setup_intent(): void
    {
        $setupIntent = $this->makeSetupIntent('seti_1_secret_test');

        $this->stripeMock
            ->shouldReceive('createSetupIntent')
            ->once()
            ->with(\Mockery::on(fn ($u) => $u->id === $this->customer->id))
            ->andReturn($setupIntent);

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/stripe/create-setup-intent');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['clientSecret' => 'seti_1_secret_test'],
            ]);
    }

    public function test_create_setup_intent_requires_auth(): void
    {
        $response = $this->postJson('/api/payments/stripe/create-setup-intent');

        $response->assertStatus(401);
    }

    public function test_create_payment_intent_for_subscription(): void
    {
        $plan = SubscriptionPlan::query()->create([
            'name' => 'Monthly Unlimited',
            'price_cents' => 9900,
            'interval' => 'monthly',
        ]);

        $paymentIntent = $this->makePaymentIntent([
            'id' => 'pi_1_test',
            'amount' => 9900,
        ]);

        $this->stripeMock
            ->shouldReceive('createPaymentIntent')
            ->once()
            ->with(
                9900,
                'EUR',
                \Mockery::on(fn ($u) => $u->id === $this->customer->id),
                \Mockery::on(fn ($m) => $m['plan_type'] === 'subscription' && $m['plan_id'] === (string) $plan->id),
            )
            ->andReturn($paymentIntent);

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/stripe/create-payment-intent', [
                'planType' => 'subscription',
                'planId' => $plan->id,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'clientSecret' => 'secret_pi_1_test',
                    'paymentIntentId' => 'pi_1_test',
                ],
            ]);
    }

    public function test_create_payment_intent_for_point_card(): void
    {
        $plan = PointCardPlan::query()->create([
            'name' => '10 Session Card',
            'price_cents' => 49000,
            'sessions_count' => 10,
            'validity_days' => 180,
        ]);

        $paymentIntent = $this->makePaymentIntent([
            'id' => 'pi_2_test',
            'amount' => 49000,
        ]);

        $this->stripeMock
            ->shouldReceive('createPaymentIntent')
            ->once()
            ->with(
                49000,
                'EUR',
                \Mockery::on(fn ($u) => $u->id === $this->customer->id),
                \Mockery::on(fn ($m) => $m['plan_type'] === 'point_card' && $m['plan_id'] === (string) $plan->id),
            )
            ->andReturn($paymentIntent);

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/stripe/create-payment-intent', [
                'planType' => 'point_card',
                'planId' => $plan->id,
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'clientSecret' => 'secret_pi_2_test',
                    'paymentIntentId' => 'pi_2_test',
                ],
            ]);
    }

    public function test_create_payment_intent_validates_plan_type(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/payments/stripe/create-payment-intent', [
                'planType' => 'invalid_type',
                'planId' => 1,
            ]);

        $response->assertStatus(422);
    }

    public function test_confirm_payment_creates_subscription(): void
    {
        $plan = SubscriptionPlan::query()->create([
            'name' => 'Monthly Unlimited',
            'price_cents' => 9900,
            'interval' => 'monthly',
        ]);

        $paymentIntent = $this->makePaymentIntent([
            'id' => 'pi_confirm_test',
            'amount' => 9900,
            'currency' => 'eur',
            'metadata' => [
                'plan_type' => 'subscription',
                'plan_id' => (string) $plan->id,
                'plan_name' => $plan->name,
                'user_id' => (string) $this->customer->id,
            ],
            'charges' => [(object) ['receipt_url' => 'https://stripe.com/receipt/test']],
        ]);

        $this->stripeMock
            ->shouldReceive('retrievePaymentIntent')
            ->once()
            ->with('pi_confirm_test')
            ->andReturn($paymentIntent);

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/stripe/confirm-payment', [
                'paymentIntentId' => 'pi_confirm_test',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => ['status' => 'completed'],
            ]);

        $this->assertDatabaseHas('payment_transactions', [
            'stripe_payment_intent_id' => 'pi_confirm_test',
            'user_id' => $this->customer->id,
            'amount_cents' => 9900,
            'status' => 'completed',
        ]);

        $this->assertDatabaseHas('customer_subscriptions', [
            'user_id' => $this->customer->id,
            'subscription_plan_id' => $plan->id,
            'status' => 'active',
        ]);
    }

    public function test_confirm_payment_creates_point_card_purchase(): void
    {
        $plan = PointCardPlan::query()->create([
            'name' => '5 Session Card',
            'price_cents' => 25000,
            'sessions_count' => 5,
            'validity_days' => 90,
        ]);

        $paymentIntent = $this->makePaymentIntent([
            'id' => 'pi_confirm_card_test',
            'amount' => 25000,
            'currency' => 'eur',
            'metadata' => [
                'plan_type' => 'point_card',
                'plan_id' => (string) $plan->id,
                'plan_name' => $plan->name,
                'user_id' => (string) $this->customer->id,
            ],
            'charges' => [(object) ['receipt_url' => 'https://stripe.com/receipt/test2']],
        ]);

        $this->stripeMock
            ->shouldReceive('retrievePaymentIntent')
            ->once()
            ->with('pi_confirm_card_test')
            ->andReturn($paymentIntent);

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/stripe/confirm-payment', [
                'paymentIntentId' => 'pi_confirm_card_test',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => ['status' => 'completed'],
            ]);

        $this->assertDatabaseHas('payment_transactions', [
            'stripe_payment_intent_id' => 'pi_confirm_card_test',
            'amount_cents' => 25000,
        ]);

        $this->assertDatabaseHas('point_card_purchases', [
            'user_id' => $this->customer->id,
            'point_card_plan_id' => $plan->id,
            'sessions_remaining' => 5,
        ]);
    }

    public function test_confirm_payment_rejects_non_succeeded(): void
    {
        $paymentIntent = $this->makePaymentIntent([
            'id' => 'pi_failed_test',
            'status' => 'requires_payment_method',
        ]);

        $this->stripeMock
            ->shouldReceive('retrievePaymentIntent')
            ->once()
            ->with('pi_failed_test')
            ->andReturn($paymentIntent);

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/stripe/confirm-payment', [
                'paymentIntentId' => 'pi_failed_test',
            ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'error' => 'Payment has not succeeded yet.',
            ]);
    }

    public function test_confirm_payment_is_idempotent(): void
    {
        SubscriptionPlan::query()->create([
            'name' => 'Monthly Unlimited',
            'price_cents' => 9900,
            'interval' => 'monthly',
        ]);

        PaymentTransaction::query()->create([
            'user_id' => $this->customer->id,
            'subscription_id' => null,
            'amount_cents' => 9900,
            'currency' => 'EUR',
            'status' => 'completed',
            'payment_method' => 'stripe',
            'stripe_payment_intent_id' => 'pi_idempotent_test',
            'description' => 'Test',
        ]);

        $paymentIntent = $this->makePaymentIntent([
            'id' => 'pi_idempotent_test',
            'status' => 'succeeded',
            'amount' => 9900,
        ]);

        $this->stripeMock
            ->shouldReceive('retrievePaymentIntent')
            ->once()
            ->with('pi_idempotent_test')
            ->andReturn($paymentIntent);

        $response = $this->withToken($this->token)
            ->postJson('/api/payments/stripe/confirm-payment', [
                'paymentIntentId' => 'pi_idempotent_test',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => ['status' => 'completed'],
            ]);

        $this->assertDatabaseCount('payment_transactions', 1);
    }

    public function test_payment_history(): void
    {
        PaymentTransaction::query()->create([
            'user_id' => $this->customer->id,
            'amount_cents' => 9900,
            'currency' => 'EUR',
            'status' => 'completed',
            'payment_method' => 'stripe',
            'stripe_payment_intent_id' => 'pi_history_1',
            'description' => 'Monthly Unlimited',
        ]);

        PaymentTransaction::query()->create([
            'user_id' => $this->customer->id,
            'amount_cents' => 49000,
            'currency' => 'EUR',
            'status' => 'completed',
            'payment_method' => 'stripe',
            'stripe_payment_intent_id' => 'pi_history_2',
            'description' => '10 Session Card',
        ]);

        $response = $this->withToken($this->token)
            ->getJson('/api/payments/history');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonCount(2, 'data');
    }

    public function test_payment_history_returns_only_own_transactions(): void
    {
        $otherUser = User::factory()->create();

        PaymentTransaction::query()->create([
            'user_id' => $this->customer->id,
            'amount_cents' => 9900,
            'currency' => 'EUR',
            'status' => 'completed',
            'payment_method' => 'stripe',
            'stripe_payment_intent_id' => 'pi_mine',
            'description' => 'Mine',
        ]);

        PaymentTransaction::query()->create([
            'user_id' => $otherUser->id,
            'amount_cents' => 9900,
            'currency' => 'EUR',
            'status' => 'completed',
            'payment_method' => 'stripe',
            'stripe_payment_intent_id' => 'pi_theirs',
            'description' => 'Theirs',
        ]);

        $response = $this->withToken($this->token)
            ->getJson('/api/payments/history');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.description', 'Mine');
    }
}
