<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ClassType;
use App\Models\Coach;
use App\Models\FreeSessionClaim;
use App\Models\Location;
use App\Models\User;
use App\Models\WeeklySchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GuestTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Location $location;
    private Coach $coach;
    private ClassType $classType;
    private WeeklySchedule $schedule;
    private Booking $booking;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->location = Location::query()->create([
            'name' => 'Test Location',
            'slug' => 'test-location',
            'address' => '123 Test St',
            'city' => 'Test City',
            'postal_code' => '12345',
            'phone' => '555-0100',
            'email' => 'location@test.com',
        ]);
        $this->coach = Coach::query()->create([
            'first_name' => 'Test',
            'last_name' => 'Coach',
            'email' => 'coach@test.com',
            'phone' => '555-0101',
        ]);
        $this->classType = ClassType::query()->create([
            'name' => 'Test Class',
            'slug' => 'test-class',
            'description' => 'A test class',
            'color' => '#ff0000',
            'duration_minutes' => 60,
            'max_capacity' => 20,
            'default_price_cents' => 2500,
        ]);
        $this->schedule = WeeklySchedule::query()->create([
            'class_type_id' => $this->classType->id,
            'coach_id' => $this->coach->id,
            'location_id' => $this->location->id,
            'day_of_week' => 1,
            'start_time' => '09:00',
            'end_time' => '10:00',
        ]);
        $this->booking = Booking::query()->create([
            'user_id' => $this->user->id,
            'schedule_id' => $this->schedule->id,
            'booking_date' => now()->addDays(3)->format('Y-m-d'),
        ]);
    }

    public function test_check_claim_returns_false_when_not_claimed(): void
    {
        $response = $this->getJson('/api/free-session-claims/check?email=new@example.com');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'claimed' => false,
                    'claim' => null,
                ],
            ]);
    }

    public function test_check_claim_returns_true_when_claimed(): void
    {
        FreeSessionClaim::query()->create([
            'email' => 'claimed@example.com',
            'booking_id' => $this->booking->id,
            'claimed_at' => now(),
        ]);

        $response = $this->getJson('/api/free-session-claims/check?email=claimed@example.com');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'claimed' => true,
                ],
            ]);
    }

    public function test_cannot_create_duplicate_claim(): void
    {
        FreeSessionClaim::query()->create([
            'email' => 'duplicate@example.com',
            'booking_id' => $this->booking->id,
            'claimed_at' => now(),
        ]);

        $response = $this->postJson('/api/free-session-claims', [
            'email' => 'duplicate@example.com',
            'bookingId' => $this->booking->id,
        ]);

        $response->assertStatus(409)
            ->assertJson([
                'success' => false,
                'error' => 'Email already claimed a free session',
            ]);
    }

    public function test_guest_can_register_from_claim(): void
    {
        $claim = FreeSessionClaim::query()->create([
            'email' => 'guest@register.test',
            'booking_id' => $this->booking->id,
            'claimed_at' => now(),
        ]);

        $response = $this->postJson('/api/guest/register', [
            'email' => 'guest@register.test',
            'password' => 'password123',
            'firstName' => 'Guest',
            'lastName' => 'User',
            'claimId' => $claim->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'user' => ['id', 'email', 'firstName', 'lastName', 'role'],
                    'token',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'guest@register.test',
            'role' => 'customer',
        ]);

        $this->assertDatabaseMissing('free_session_claims', [
            'id' => $claim->id,
            'user_id' => null,
        ]);
    }

    public function test_guest_register_fails_if_claim_already_activated(): void
    {
        $claim = FreeSessionClaim::query()->create([
            'email' => 'activated@test.test',
            'booking_id' => $this->booking->id,
            'user_id' => $this->user->id,
            'claimed_at' => now(),
        ]);

        $response = $this->postJson('/api/guest/register', [
            'email' => 'activated@test.test',
            'password' => 'password123',
            'firstName' => 'Already',
            'lastName' => 'Activated',
            'claimId' => $claim->id,
        ]);

        $response->assertStatus(409)
            ->assertJson([
                'success' => false,
                'error' => 'Claim already activated',
            ]);
    }

    public function test_guest_register_fails_if_email_does_not_match_claim(): void
    {
        $claim = FreeSessionClaim::query()->create([
            'email' => 'original@test.test',
            'booking_id' => $this->booking->id,
            'claimed_at' => now(),
        ]);

        $response = $this->postJson('/api/guest/register', [
            'email' => 'different@test.test',
            'password' => 'password123',
            'firstName' => 'Wrong',
            'lastName' => 'Email',
            'claimId' => $claim->id,
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'error' => 'Email does not match claim',
            ]);
    }
}
