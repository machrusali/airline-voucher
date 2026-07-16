<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Cast;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'crew_name',
    'crew_id',
    'flight_number',
    'flight_date',
    'aircraft_type',
    'seat1',
    'seat2',
    'seat3',
])]

class Voucher extends Model
{
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'flight_date' => 'date',
    ];
}
