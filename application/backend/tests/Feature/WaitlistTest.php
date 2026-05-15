<?php

namespace Tests\Feature;

use App\Models\ClassType;
use App\Models\Coach;
use App\Models\Location;
use App\Models\User;
use App\Models\WaitlistEntry;
use App\Models\WeeklySchedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WaitlistTest extends TestCase
{
    use RefreshDatabase;

    private User $customer;
    private User $admin;
    private string $token;
    private string $adminToken;
    private WeeklySchedule $schedule;

    protected function setUp(): void
    {
        parent::setUp();

        $this->customer = User::factory()->create();
        $this->token = $this->customer->createToken('test')->plainTextToken;

        $this->admin = User::factory()->admin()->create();
        $this->adminToken = $this->admin->createToken('test')->plainTextToken;

        $location = Location::query()->create([
            'name' => 'Test Location', 'slug' => 'test-location',
            'address' => '123 Test St', 'city' => 'Test City',
            'postal_code' => '12345', 'phone' => '555-0100', 'email' => 'loc@test.com',
        ]);
        $coach = Coach::query()->create([
            'first_name' => 'Test', 'last_name' => 'Coach', 'email' => 'coach@test.com',
        ]);
        $classType = ClassType::query()->create([
            'name' => 'Yoga', 'slug' => 'yoga', 'color' => '#ff0000',
            'duration_minutes' => 60, 'max_capacity' => 20,
        ]);
        $this->schedule = WeeklySchedule::query()->create([
            'class_type_id' => $classType->id,
            'coach_id' => $coach->id,
            'location_id' => $location->id,
            'day_of_week' => 1,
            'start_time' => '09:00',
            'end_time' => '10:00',
        ]);
    }

    public function test_list_waitlist(): void
    {
        WaitlistEntry::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $this->schedule->id,
            'date' => now()->addDay()->format('Y-m-d'),
            'status' => 'waiting',
        ]);

        $response = $this->withToken($this->token)
            ->getJson('/api/waitlist');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_join_waitlist(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/waitlist/join', [
                'userId' => $this->customer->id,
                'scheduleId' => $this->schedule->id,
                'date' => now()->addDay()->format('Y-m-d'),
            ]);

        $response->assertStatus(201)->assertJsonPath('success', true);
        $this->assertDatabaseHas('waitlist', ['user_id' => $this->customer->id]);
    }

    public function test_leave_waitlist(): void
    {
        $entry = WaitlistEntry::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $this->schedule->id,
            'date' => now()->addDay()->format('Y-m-d'),
        ]);

        $response = $this->withToken($this->token)
            ->postJson("/api/waitlist/{$entry->id}/leave");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('waitlist', ['id' => $entry->id]);
    }

    public function test_customer_promote_waitlist(): void
    {
        $entry = WaitlistEntry::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $this->schedule->id,
            'date' => now()->addDay()->format('Y-m-d'),
            'status' => 'waiting',
        ]);

        $response = $this->withToken($this->token)
            ->postJson("/api/waitlist/{$entry->id}/promote");

        $response->assertStatus(200);
        $this->assertDatabaseHas('waitlist', ['id' => $entry->id, 'status' => 'promoted']);
    }

    public function test_admin_list_waitlist(): void
    {
        WaitlistEntry::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $this->schedule->id,
            'date' => now()->addDay()->format('Y-m-d'),
        ]);

        $response = $this->withToken($this->adminToken)
            ->getJson('/api/admin/waitlist');

        $response->assertStatus(200)->assertJsonCount(1, 'data');
    }

    public function test_admin_promote_waitlist(): void
    {
        $entry = WaitlistEntry::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $this->schedule->id,
            'date' => now()->addDay()->format('Y-m-d'),
        ]);

        $response = $this->withToken($this->adminToken)
            ->postJson("/api/admin/waitlist/{$entry->id}/promote");

        $response->assertStatus(200);
    }

    public function test_admin_remove_waitlist(): void
    {
        $entry = WaitlistEntry::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $this->schedule->id,
            'date' => now()->addDay()->format('Y-m-d'),
        ]);

        $response = $this->withToken($this->adminToken)
            ->postJson("/api/admin/waitlist/{$entry->id}/remove");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('waitlist', ['id' => $entry->id]);
    }

    public function test_admin_notify_all_waitlist(): void
    {
        WaitlistEntry::query()->create([
            'user_id' => $this->customer->id,
            'schedule_id' => $this->schedule->id,
            'date' => now()->addDay()->format('Y-m-d'),
            'status' => 'waiting',
        ]);

        $response = $this->withToken($this->adminToken)
            ->postJson('/api/admin/waitlist/notify-all', [
                'scheduleId' => $this->schedule->id,
                'date' => now()->addDay()->format('Y-m-d'),
            ]);

        $data = $response->json();
        $this->assertTrue($response->status() === 200, 'Response: ' . json_encode($data));
        $this->assertArrayHasKey('notified', $data['data'] ?? []);
    }
}
