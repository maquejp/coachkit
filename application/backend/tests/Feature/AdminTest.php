<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Booking;
use App\Models\ClassType;
use App\Models\Coach;
use App\Models\CustomerSubscription;
use App\Models\Location;
use App\Models\PaymentTransaction;
use App\Models\PointCardPlan;
use App\Models\PointCardPurchase;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\WeeklySchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $customer;
    private string $adminToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->admin()->create();
        $this->adminToken = $this->admin->createToken('test')->plainTextToken;

        $this->customer = User::factory()->create();
    }

    private function makeLocation(): Location
    {
        return Location::query()->create([
            'name' => 'L', 'slug' => 'l',
            'address' => 'Addr', 'city' => 'City',
            'postal_code' => '123', 'phone' => '555', 'email' => 'e@t.com',
        ]);
    }

    private function makeCoach(): Coach
    {
        return Coach::query()->create([
            'first_name' => 'C', 'last_name' => 'C', 'email' => 'c@t.com',
        ]);
    }

    private function makeClassType(): ClassType
    {
        return ClassType::query()->create([
            'name' => 'Y', 'slug' => 'y', 'duration_minutes' => 60, 'max_capacity' => 20,
        ]);
    }

    public function test_dashboard_kpis(): void
    {
        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/dashboard/kpis');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data' => [
                'totalBookings', 'confirmedBookings', 'revenueCents',
                'activeMembers', 'occupancyRate',
            ]]);
    }

    public function test_dashboard_charts(): void
    {
        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/dashboard/charts');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data' => [
                'bookingsByDay', 'revenueByMonth', 'classPopularity',
            ]]);
    }

    public function test_dashboard_occupancy(): void
    {
        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/dashboard/occupancy');

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data' => [
                'averageOccupancy', 'peakDay', 'peakTime', 'byClass',
            ]]);
    }

    public function test_admin_customers_list(): void
    {
        User::factory()->count(3)->create(['role' => 'customer']);

        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/customers');

        $response->assertStatus(200)
            ->assertJsonPath('data.total', 4);
    }

    public function test_admin_customer_show(): void
    {
        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/customers/' . $this->customer->id);

        $response->assertStatus(200)->assertJsonPath('success', true);
    }

    public function test_admin_customer_subscriptions(): void
    {
        $plan = SubscriptionPlan::query()->create(['name' => 'P', 'price_cents' => 1000]);
        CustomerSubscription::query()->create([
            'user_id' => $this->customer->id,
            'subscription_plan_id' => $plan->id,
            'start_date' => now(),
            'status' => 'active',
        ]);

        $response = $this->withToken($this->adminToken)
            ->getJson("/api/admin/customers/{$this->customer->id}/subscriptions");

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_admin_customer_point_cards(): void
    {
        $plan = PointCardPlan::query()->create([
            'name' => 'Pack', 'sessions_count' => 5,
            'price_cents' => 9000, 'validity_days' => 90,
        ]);
        PointCardPurchase::query()->create([
            'user_id' => $this->customer->id,
            'point_card_plan_id' => $plan->id,
            'sessions_remaining' => 5,
            'purchase_date' => now(),
        ]);

        $response = $this->withToken($this->adminToken)
            ->getJson("/api/admin/customers/{$this->customer->id}/point-cards");

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_admin_customer_bookings(): void
    {
        $loc = $this->makeLocation();
        $coach = $this->makeCoach();
        $ct = $this->makeClassType();
        $ws = WeeklySchedule::query()->create([
            'class_type_id' => $ct->id, 'coach_id' => $coach->id,
            'location_id' => $loc->id, 'day_of_week' => 1,
            'start_time' => '09:00', 'end_time' => '10:00',
        ]);
        Booking::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $ws->id,
            'booking_date' => now()->addDay()->format('Y-m-d'),
        ]);

        $response = $this->withToken($this->adminToken)
            ->getJson("/api/admin/customers/{$this->customer->id}/bookings");

        $response->assertStatus(200)->assertJsonPath('data.total', 1);
    }

    public function test_admin_customer_attendance(): void
    {
        $loc = $this->makeLocation();
        $coach = $this->makeCoach();
        $ct = $this->makeClassType();
        $ws = WeeklySchedule::query()->create([
            'class_type_id' => $ct->id, 'coach_id' => $coach->id,
            'location_id' => $loc->id, 'day_of_week' => 1,
            'start_time' => '09:00', 'end_time' => '10:00',
        ]);
        $booking = Booking::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $ws->id,
            'booking_date' => now()->format('Y-m-d'),
        ]);
        Attendance::query()->create([
            'booking_id' => $booking->id,
            'user_id' => $this->customer->id,
            'class_type_id' => $ct->id,
            'marked_by' => $this->admin->id,
            'attended_at' => now(),
        ]);

        $response = $this->withToken($this->adminToken)
            ->getJson("/api/admin/customers/{$this->customer->id}/attendance");

        $response->assertStatus(200)->assertJson(['data' => ['total' => 1]]);
    }

    public function test_admin_customer_payments(): void
    {
        PaymentTransaction::query()->create([
            'user_id' => $this->customer->id,
            'amount_cents' => 1000,
            'currency' => 'USD',
            'status' => 'completed',
            'payment_method' => 'stripe',
            'description' => 'Test payment',
        ]);

        $response = $this->withToken($this->adminToken)
            ->getJson("/api/admin/customers/{$this->customer->id}/payments");

        $response->assertStatus(200)->assertJson(['data' => ['total' => 1]]);
    }

    public function test_admin_impersonate(): void
    {
        $response = $this->withToken($this->adminToken)
            ->postJson('/api/admin/impersonate', [
                'userId' => $this->customer->id,
            ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data' => ['user', 'token']]);
    }

    public function test_admin_checkin_bookings(): void
    {
        $loc = $this->makeLocation();
        $coach = $this->makeCoach();
        $ct = $this->makeClassType();
        $ws = WeeklySchedule::query()->create([
            'class_type_id' => $ct->id, 'coach_id' => $coach->id,
            'location_id' => $loc->id, 'day_of_week' => 1,
            'start_time' => '09:00', 'end_time' => '10:00',
        ]);
        Booking::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $ws->id,
            'booking_date' => now()->format('Y-m-d'),
        ]);

        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/attendance/check-in?date=' . now()->format('Y-m-d'));

        $response->assertStatus(200);
    }

    public function test_admin_checkin(): void
    {
        $loc = $this->makeLocation();
        $coach = $this->makeCoach();
        $ct = $this->makeClassType();
        $ws = WeeklySchedule::query()->create([
            'class_type_id' => $ct->id, 'coach_id' => $coach->id,
            'location_id' => $loc->id, 'day_of_week' => 1,
            'start_time' => '09:00', 'end_time' => '10:00',
        ]);
        $booking = Booking::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $ws->id,
            'booking_date' => now()->format('Y-m-d'),
        ]);

        $response = $this->withToken($this->adminToken)
            ->postJson('/api/admin/attendance/check-in', ['bookingId' => $booking->id]);

        $response->assertStatus(201)->assertJsonPath('success', true);
    }

    public function test_admin_reports(): void
    {
        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/reports/customers');
        $response->assertStatus(200);

        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/reports/subscriptions');
        $response->assertStatus(200);

        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/reports/revenue');
        $response->assertStatus(200);
    }

    public function test_admin_session_usage(): void
    {
        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/session-usage');

        $response->assertStatus(200);
    }

    public function test_admin_analytics(): void
    {
        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/analytics');

        $response->assertStatus(200);
    }

    public function test_admin_settings(): void
    {
        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/settings');

        $response->assertStatus(200);
    }

    public function test_admin_update_settings(): void
    {
        $response = $this->withToken($this->adminToken)
            ->putJson('/api/admin/settings', ['studioName' => 'New Studio']);

        $response->assertStatus(200)->assertJsonPath('data.studioName', 'New Studio');
    }
}
