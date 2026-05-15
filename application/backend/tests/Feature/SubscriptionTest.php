<?php

namespace Tests\Feature;

use App\Models\ClassType;
use App\Models\Coach;
use App\Models\CustomerSubscription;
use App\Models\Location;
use App\Models\PointCardPlan;
use App\Models\PointCardPurchase;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\WaitlistEntry;
use App\Models\WeeklySchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    private User $customer;
    private User $admin;
    private string $token;
    private string $adminToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::factory()->create();
        $this->token = $this->customer->createToken('test')->plainTextToken;

        $this->admin = User::factory()->admin()->create();
        $this->adminToken = $this->admin->createToken('test')->plainTextToken;
    }

    public function test_list_subscription_plans(): void
    {
        SubscriptionPlan::query()->create([
            'name' => 'Monthly Unlimited',
            'price_cents' => 9900,
            'interval' => 'monthly',
        ]);

        $response = $this->getJson('/api/subscription-plans');

        $response->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonCount(1, 'data');
    }

    public function test_show_subscription_plan(): void
    {
        $plan = SubscriptionPlan::query()->create([
            'name' => 'Annual Plan',
            'price_cents' => 89900,
            'interval' => 'yearly',
        ]);

        $response = $this->getJson("/api/subscription-plans/{$plan->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Annual Plan');
    }

    public function test_show_subscription_plan_404(): void
    {
        $response = $this->getJson('/api/subscription-plans/999');
        $response->assertStatus(404);
    }

    public function test_admin_can_create_subscription_plan(): void
    {
        $response = $this->withToken($this->adminToken)
            ->postJson('/api/admin/subscription-plans', [
                'name' => 'New Plan',
                'priceCents' => 5000,
                'interval' => 'monthly',
                'features' => ['Feature A', 'Feature B'],
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'New Plan');
    }

    public function test_non_admin_cannot_create_subscription_plan(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/admin/subscription-plans', [
                'name' => 'New Plan',
                'priceCents' => 5000,
            ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_subscription_plan(): void
    {
        $plan = SubscriptionPlan::query()->create([
            'name' => 'Old Name',
            'price_cents' => 5000,
        ]);

        $response = $this->withToken($this->adminToken)
            ->putJson("/api/admin/subscription-plans/{$plan->id}", [
                'name' => 'New Name',
                'priceCents' => 6000,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'New Name');
    }

    public function test_admin_can_delete_subscription_plan(): void
    {
        $plan = SubscriptionPlan::query()->create([
            'name' => 'Delete Me',
            'price_cents' => 5000,
        ]);

        $response = $this->withToken($this->adminToken)
            ->deleteJson("/api/admin/subscription-plans/{$plan->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted($plan);
    }

    public function test_list_customer_subscriptions(): void
    {
        $plan = SubscriptionPlan::query()->create(['name' => 'Plan', 'price_cents' => 1000]);
        CustomerSubscription::query()->create([
            'user_id' => $this->customer->id,
            'subscription_plan_id' => $plan->id,
            'start_date' => now(),
            'status' => 'active',
        ]);

        $response = $this->withToken($this->token)
            ->getJson('/api/customer-subscriptions?userId=' . $this->customer->id);

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_create_customer_subscription(): void
    {
        $plan = SubscriptionPlan::query()->create(['name' => 'Plan', 'price_cents' => 1000]);

        $response = $this->withToken($this->token)
            ->postJson('/api/customer-subscriptions', [
                'userId' => $this->customer->id,
                'subscriptionPlanId' => $plan->id,
                'startDate' => now()->format('Y-m-d'),
            ]);

        $response->assertStatus(201)->assertJsonPath('success', true);
        $this->assertDatabaseHas('customer_subscriptions', ['user_id' => $this->customer->id]);
    }

    public function test_cancel_customer_subscription(): void
    {
        $plan = SubscriptionPlan::query()->create(['name' => 'Plan', 'price_cents' => 1000]);
        $sub = CustomerSubscription::query()->create([
            'user_id' => $this->customer->id,
            'subscription_plan_id' => $plan->id,
            'start_date' => now(),
            'status' => 'active',
        ]);

        $response = $this->withToken($this->token)
            ->postJson("/api/customer-subscriptions/{$sub->id}/cancel");

        $response->assertStatus(200);
        $this->assertDatabaseHas('customer_subscriptions', [
            'id' => $sub->id,
            'status' => 'cancelled',
        ]);
    }

    public function test_change_subscription_plan(): void
    {
        $plan1 = SubscriptionPlan::query()->create(['name' => 'Plan A', 'price_cents' => 1000]);
        $plan2 = SubscriptionPlan::query()->create(['name' => 'Plan B', 'price_cents' => 2000]);
        $sub = CustomerSubscription::query()->create([
            'user_id' => $this->customer->id,
            'subscription_plan_id' => $plan1->id,
            'start_date' => now(),
            'status' => 'active',
        ]);

        $response = $this->withToken($this->token)
            ->putJson("/api/customer-subscriptions/{$sub->id}/change-plan", [
                'planId' => $plan2->id,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('customer_subscriptions', [
            'id' => $sub->id,
            'subscription_plan_id' => $plan2->id,
        ]);
    }

    public function test_list_point_card_plans(): void
    {
        PointCardPlan::query()->create([
            'name' => '5-Class Pack',
            'sessions_count' => 5,
            'price_cents' => 9000,
            'validity_days' => 90,
        ]);

        $response = $this->getJson('/api/point-card-plans');
        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_list_point_card_purchases(): void
    {
        $plan = PointCardPlan::query()->create([
            'name' => 'Pack',
            'sessions_count' => 5,
            'price_cents' => 9000,
            'validity_days' => 90,
        ]);
        PointCardPurchase::query()->create([
            'user_id' => $this->customer->id,
            'point_card_plan_id' => $plan->id,
            'sessions_remaining' => 5,
            'purchase_date' => now(),
        ]);

        $response = $this->withToken($this->token)
            ->getJson('/api/point-card-purchases?userId=' . $this->customer->id);
        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_create_point_card_purchase(): void
    {
        $plan = PointCardPlan::query()->create([
            'name' => 'Pack',
            'sessions_count' => 5,
            'price_cents' => 9000,
            'validity_days' => 90,
        ]);

        $response = $this->withToken($this->token)
            ->postJson('/api/point-card-purchases', [
                'userId' => $this->customer->id,
                'pointCardPlanId' => $plan->id,
                'sessionsRemaining' => 5,
            ]);

        $response->assertStatus(201);
    }

    public function test_admin_crud_point_card_plans(): void
    {
        // Create
        $response = $this->withToken($this->adminToken)
            ->postJson('/api/admin/point-card-plans', [
                'name' => 'New Pack',
                'sessionsCount' => 10,
                'priceCents' => 16000,
                'validityDays' => 180,
            ]);
        $response->assertStatus(201);
        $id = $response->json('data.id');

        // Update
        $response = $this->withToken($this->adminToken)
            ->putJson("/api/admin/point-card-plans/{$id}", ['name' => 'Updated Pack']);
        $response->assertStatus(200)->assertJsonPath('data.name', 'Updated Pack');

        // Delete
        $response = $this->withToken($this->adminToken)
            ->deleteJson("/api/admin/point-card-plans/{$id}");
        $response->assertStatus(200);
    }

    public function test_single_session_pricing(): void
    {
        ClassType::query()->create([
            'name' => 'Yoga',
            'slug' => 'yoga',
            'duration_minutes' => 60,
            'max_capacity' => 20,
            'default_price_cents' => 2000,
        ]);

        $response = $this->withToken($this->token)
            ->getJson('/api/single-session-pricing');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_profile_update(): void
    {
        $response = $this->withToken($this->token)
            ->putJson('/api/profile', [
                'firstName' => 'Updated',
                'lastName' => 'Name',
            ]);

        $response->assertStatus(200)->assertJsonPath('data.firstName', 'Updated');
    }

    public function test_profile_change_password(): void
    {
        $this->customer->update(['password' => bcrypt('currentpass')]);

        $response = $this->withToken($this->token)
            ->putJson('/api/profile/password', [
                'currentPassword' => 'currentpass',
                'newPassword' => 'newpass1234',
            ]);

        $response->assertStatus(200);
    }

    public function test_profile_change_password_wrong_current(): void
    {
        $response = $this->withToken($this->token)
            ->putJson('/api/profile/password', [
                'currentPassword' => 'wrongpass',
                'newPassword' => 'newpass1234',
            ]);

        $response->assertStatus(422);
    }

    public function test_profile_delete(): void
    {
        $response = $this->withToken($this->token)
            ->deleteJson('/api/profile');

        $response->assertStatus(200);
        $this->assertSoftDeleted($this->customer);
    }
}
