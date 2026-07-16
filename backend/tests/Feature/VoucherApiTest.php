<?php

namespace Tests\Feature;

use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VoucherApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_check_endpoint_returns_false_if_flight_does_not_exist()
    {
        $response = $this->postJson('/api/check', [
            'flightNumber' => 'GA102',
            'date' => '17-07-2026'
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'exists' => false
                 ]);
    }

    public function test_check_endpoint_returns_true_if_flight_exists()
    {
        Voucher::create([
            'crew_name' => 'Sarah',
            'crew_id' => '98123',
            'flight_number' => 'GA102',
            'flight_date' => '2026-07-17',
            'aircraft_type' => 'Airbus 320',
            'seat1' => '1A',
            'seat2' => '1B',
            'seat3' => '1C'
        ]);

        $response = $this->postJson('/api/check', [
            'flightNumber' => 'GA102',
            'date' => '17-07-2026'
        ]);

        $response->assertStatus(200)
                 ->assertJson([
                     'exists' => true
                 ]);
    }

    public function test_generate_endpoint_successfully_creates_vouchers()
    {
        $payload = [
            'name' => 'Sarah',
            'id' => '98123',
            'flightNumber' => 'GA102',
            'date' => '17-07-2026',
            'aircraft' => 'Airbus 320'
        ];

        $response = $this->postJson('/api/generate', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true)
                 ->assertJsonStructure([
                     'success',
                     'data' => [
                         'crewName',
                         'crewId',
                         'flightNumber',
                         'date',
                         'aircraft',
                         'seats'
                     ]
                 ]);

        $this->assertDatabaseHas('vouchers', [
            'crew_name' => 'Sarah',
            'crew_id' => '98123',
            'flight_number' => 'GA102'
        ]);

        $seats = $response->json('data.seats');
        $this->assertCount(3, $seats);
        $this->assertEquals(count($seats), count(array_unique($seats)));
    }

    public function test_generate_endpoint_validation_fails_with_invalid_data()
    {
        $response = $this->postJson('/api/generate', [
            'name' => '',
            'id' => '',
            'flightNumber' => '',
            'date' => '',
            'aircraft' => 'PesawatAlien'
        ]);

        $response->assertStatus(422);
    }
}