<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ClassType;
use App\Models\Coach;
use App\Models\CustomerSubscription;
use App\Models\FreeSessionClaim;
use App\Models\Location;
use App\Models\PaymentTransaction;
use App\Models\SubscriptionPlan;
use App\Models\WeeklySchedule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CRUDTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->admin()->create();
        $this->token = $this->admin->createToken('test')->plainTextToken;
    }

    private function auth(): CRUDTest
    {
        return $this->withToken($this->token);
    }

    // --- Location CRUD ---

    public function test_admin_can_create_location(): void
    {
        $response = $this->auth()->postJson('/api/admin/locations', [
            'name' => 'Downtown Studio', 'slug' => 'downtown-studio',
            'address' => '123 Main St', 'city' => 'Portland',
            'postal_code' => '97201', 'phone' => '555-0100',
            'email' => 'downtown@coachkit.app',
        ]);

        $response->assertStatus(201)->assertJsonPath('success', true);
        $this->assertDatabaseHas('locations', ['name' => 'Downtown Studio']);
    }

    public function test_non_admin_cannot_update_location(): void
    {
        $location = $this->makeLocation();
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->putJson("/api/admin/locations/{$location->id}", [
            'name' => 'Hacked Name',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_location(): void
    {
        $location = $this->makeLocation();

        $response = $this->auth()->putJson("/api/admin/locations/{$location->id}", ['name' => 'New Name']);

        $response->assertStatus(200)->assertJsonPath('data.name', 'New Name');
        $this->assertDatabaseHas('locations', ['name' => 'New Name']);
    }

    public function test_admin_can_delete_location(): void
    {
        $location = $this->makeLocation();

        $response = $this->auth()->deleteJson("/api/admin/locations/{$location->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('locations', ['id' => $location->id]);
    }

    // --- Class Type CRUD ---

    public function test_admin_can_create_class_type(): void
    {
        $response = $this->auth()->postJson('/api/admin/class-types', [
            'name' => 'Power Yoga', 'slug' => 'power-yoga',
            'description' => 'Intense yoga session', 'color' => '#ff0000',
            'duration_minutes' => 60, 'max_capacity' => 20,
        ]);

        $response->assertStatus(201)->assertJsonPath('success', true);
        $this->assertDatabaseHas('class_types', ['name' => 'Power Yoga']);
    }

    public function test_admin_can_update_class_type(): void
    {
        $ct = ClassType::query()->create([
            'name' => 'Old Class', 'slug' => 'old', 'description' => 'Desc', 'color' => '#000',
            'duration_minutes' => 30, 'max_capacity' => 10,
        ]);

        $response = $this->auth()->putJson("/api/admin/class-types/{$ct->id}", ['name' => 'New Class']);

        $response->assertStatus(200)->assertJsonPath('data.name', 'New Class');
        $this->assertDatabaseHas('class_types', ['name' => 'New Class']);
    }

    public function test_admin_can_delete_class_type(): void
    {
        $ct = ClassType::query()->create([
            'name' => 'To Delete', 'slug' => 'del', 'description' => 'Desc', 'color' => '#000',
            'duration_minutes' => 30, 'max_capacity' => 10,
        ]);

        $response = $this->auth()->deleteJson("/api/admin/class-types/{$ct->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('class_types', ['id' => $ct->id]);
    }

    // --- Coach CRUD ---

    public function test_admin_can_create_coach(): void
    {
        $response = $this->auth()->postJson('/api/admin/coaches', [
            'first_name' => 'Jane', 'last_name' => 'Smith',
            'email' => 'jane@coachkit.app', 'bio' => 'Experienced yoga instructor',
        ]);

        $response->assertStatus(201)->assertJsonPath('success', true);
        $this->assertDatabaseHas('coaches', ['email' => 'jane@coachkit.app']);
    }

    public function test_admin_can_update_coach(): void
    {
        $coach = Coach::query()->create([
            'first_name' => 'Old', 'last_name' => 'Name', 'email' => 'old@t.com',
        ]);

        $response = $this->auth()->putJson("/api/admin/coaches/{$coach->id}", ['first_name' => 'New']);

        $response->assertStatus(200)->assertJsonPath('data.firstName', 'New');
        $this->assertDatabaseHas('coaches', ['first_name' => 'New']);
    }

    public function test_admin_can_delete_coach(): void
    {
        $coach = Coach::query()->create([
            'first_name' => 'Del', 'last_name' => 'Ette', 'email' => 'del@t.com',
        ]);

        $response = $this->auth()->deleteJson("/api/admin/coaches/{$coach->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('coaches', ['id' => $coach->id]);
    }

    // --- Booking CRUD ---

    public function test_customer_can_create_booking(): void
    {
        $customer = User::factory()->create();
        $token = $customer->createToken('test')->plainTextToken;
        $schedule = $this->makeSchedule();

        $response = $this->withToken($token)->postJson('/api/bookings', [
            'scheduleId' => $schedule->id,
            'bookingDate' => now()->addDay()->format('Y-m-d'),
        ]);

        $response->assertStatus(201)->assertJsonPath('success', true);
        $this->assertDatabaseHas('bookings', ['user_id' => $customer->id]);
    }

    public function test_customer_can_cancel_booking(): void
    {
        $customer = User::factory()->create();
        $token = $customer->createToken('test')->plainTextToken;
        $schedule = $this->makeSchedule();

        $booking = Booking::query()->create([
            'user_id' => $customer->id, 'schedule_id' => $schedule->id,
            'booking_date' => now()->addDay()->format('Y-m-d'), 'status' => 'confirmed',
        ]);

        $response = $this->withToken($token)->postJson("/api/bookings/{$booking->id}/cancel");

        $response->assertStatus(200);
        $this->assertDatabaseHas('bookings', ['id' => $booking->id, 'status' => 'cancelled']);
    }

    public function test_guest_can_create_free_session_claim(): void
    {
        $schedule = $this->makeSchedule();
        $customer = User::factory()->create();
        $booking = Booking::query()->create([
            'user_id' => $customer->id, 'schedule_id' => $schedule->id,
            'booking_date' => now()->addDay()->format('Y-m-d'), 'status' => 'confirmed',
        ]);

        $response = $this->postJson('/api/free-session-claims', [
            'email' => 'guest@example.com',
            'bookingId' => $booking->id,
        ]);

        $response->assertStatus(201);
    }

    // --- Contact Form ---

    public function test_contact_form_submission(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => 'John Doe', 'email' => 'john@example.com',
            'phone' => '555-0100', 'message' => 'I have a question about memberships.',
        ]);

        $response->assertStatus(200)->assertJsonPath('success', true);
    }

    // --- 404 Handling ---

    public function test_unknown_route_returns_404(): void
    {
        $response = $this->getJson('/api/nonexistent-route');
        $response->assertStatus(404);
    }

    // --- Pagination ---

    public function test_list_endpoints_return_paginated_structure(): void
    {
        $response = $this->auth()->getJson('/api/admin/customers');
        $response->assertStatus(200)
            ->assertJsonStructure(['success', 'data' => ['items', 'total', 'totalPages', 'page', 'pageSize']]);
    }

    public function test_pagination_respects_page_size(): void
    {
        User::factory()->count(10)->create(['role' => 'customer']);

        $response = $this->auth()->getJson('/api/admin/customers?pageSize=3');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertCount(3, $data['items']);
        $this->assertEquals(4, $data['totalPages']);
    }

    public function test_pagination_second_page(): void
    {
        User::factory()->count(10)->create(['role' => 'customer']);

        $response = $this->auth()->getJson('/api/admin/customers?page=2&pageSize=3');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals(2, $data['page']);
        $this->assertGreaterThan(0, count($data['items']));
    }

    // --- Validation Errors ---

    public function test_validation_error_on_missing_fields(): void
    {
        $response = $this->auth()->postJson('/api/admin/locations', []);
        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors']);
    }

    public function test_validation_error_on_invalid_booking(): void
    {
        $customer = User::factory()->create();
        $token = $customer->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/bookings', []);
        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors']);
    }

    public function test_validation_error_on_invalid_contact(): void
    {
        $response = $this->postJson('/api/contact', [
            'name' => '',
            'email' => 'not-an-email',
            'message' => '',
        ]);
        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors']);
    }

    public function test_409_conflict_on_duplicate_free_session(): void
    {
        $schedule = $this->makeSchedule();
        $customer = User::factory()->create();
        $booking = Booking::query()->create([
            'user_id' => $customer->id, 'schedule_id' => $schedule->id,
            'booking_date' => now()->addDay()->format('Y-m-d'), 'status' => 'confirmed',
        ]);

        $this->postJson('/api/free-session-claims', [
            'email' => 'dup@example.com',
            'bookingId' => $booking->id,
        ])->assertStatus(201);

        $response = $this->postJson('/api/free-session-claims', [
            'email' => 'dup@example.com',
            'bookingId' => $booking->id,
        ]);

        $response->assertStatus(409);
    }

    // --- Search / Filter ---

    public function test_search_customers_by_name(): void
    {
        User::factory()->create(['first_name' => 'Alice', 'last_name' => 'Smith', 'role' => 'customer']);
        User::factory()->create(['first_name' => 'Bob', 'last_name' => 'Jones', 'role' => 'customer']);

        $response = $this->auth()->getJson('/api/admin/customers?search=Alice');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals(1, $data['total']);
    }

    public function test_search_customers_by_email(): void
    {
        User::factory()->create(['email' => 'findme@test.com', 'role' => 'customer']);
        User::factory()->create(['email' => 'other@test.com', 'role' => 'customer']);

        $response = $this->auth()->getJson('/api/admin/customers?search=findme');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals(1, $data['total']);
    }

    public function test_filter_bookings_by_user(): void
    {
        $customer = User::factory()->create();
        $other = User::factory()->create();
        $schedule = $this->makeSchedule();

        Booking::query()->create([
            'user_id' => $customer->id, 'schedule_id' => $schedule->id,
            'booking_date' => now()->addDay()->format('Y-m-d'), 'status' => 'confirmed',
        ]);
        Booking::query()->create([
            'user_id' => $other->id, 'schedule_id' => $schedule->id,
            'booking_date' => now()->addDay()->format('Y-m-d'), 'status' => 'confirmed',
        ]);

        $token = $customer->createToken('test')->plainTextToken;
        $response = $this->withToken($token)->getJson('/api/bookings?userId=' . $customer->id);
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals(1, $data['total']);
    }

    // --- Helpers ---

    private function makeLocation(): Location
    {
        return Location::query()->create([
            'name' => 'Studio', 'slug' => 'studio', 'address' => 'Addr',
            'city' => 'City', 'postal_code' => '123', 'phone' => '555',
            'email' => 's@t.com', 'is_active' => true,
        ]);
    }

    private function makeSchedule(): WeeklySchedule
    {
        return WeeklySchedule::query()->create([
            'class_type_id' => ClassType::query()->create([
                'name' => 'Test Class', 'slug' => 'test-class', 'description' => 'Desc',
                'color' => '#000', 'duration_minutes' => 30, 'max_capacity' => 20,
            ])->id,
            'coach_id' => Coach::query()->create([
                'first_name' => 'Coach', 'last_name' => 'One', 'email' => 'coach@t.com',
            ])->id,
            'location_id' => Location::query()->create([
                'name' => 'Loc', 'slug' => 'loc', 'address' => 'Addr', 'city' => 'City',
                'postal_code' => '123', 'phone' => '555', 'email' => 'l@t.com',
            ])->id,
            'day_of_week' => 1, 'start_time' => '09:00', 'end_time' => '10:00',
            'max_capacity' => 20, 'is_active' => true,
        ]);
    }
}
