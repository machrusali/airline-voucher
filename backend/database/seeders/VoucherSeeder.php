<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class VoucherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vouchers = [
            [
                'crew_name'     => 'Sarah',
                'crew_id'       => '98123',
                'flight_number' => 'GA102',
                'flight_date'   => '12-07-2025',
                'aircraft_type' => 'Airbus 320',
                'seat1'         => '3B',
                'seat2'         => '17F',
                'seat3'         => '22A',
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],
            [
                'crew_name'     => 'John Doe',
                'crew_id'       => '98124',
                'flight_number' => 'IL205',
                'flight_date'   => '15-07-2025',
                'aircraft_type' => 'ATR',
                'seat1'         => '1A',
                'seat2'         => '5C',
                'seat3'         => '18D',
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],
            [
                'crew_name'     => 'Michael Scott',
                'crew_id'       => '95421',
                'flight_number' => 'GA200',
                'flight_date'   => '18-07-2025',
                'aircraft_type' => 'Boeing 737 Max',
                'seat1'         => '12B',
                'seat2'         => '14E',
                'seat3'         => '32F',
                'created_at'    => Carbon::now(),
                'updated_at'    => Carbon::now(),
            ],
        ];

        DB::table('vouchers')->insert($vouchers);
    }
}