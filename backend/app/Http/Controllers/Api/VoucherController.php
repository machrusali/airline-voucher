<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\VoucherAlreadyExistsException;
use App\Http\Controllers\Controller;
use App\Http\Requests\CheckVoucherRequest;
use App\Http\Requests\GenerateVoucherRequest;
use App\Http\Resources\VoucherResource;
use App\Models\Voucher;
use App\Services\SeatGeneratorService;

class VoucherController extends Controller
{
    public function check(CheckVoucherRequest $request)
    {
        $exists = Voucher::query()
            ->where('flight_number', $request->flightNumber)
            ->whereDate('flight_date', $request->date)
            ->exists();

        return response()->json([
            'exists' => $exists,
        ]);
    }

    public function generate(
        GenerateVoucherRequest $request,
        SeatGeneratorService $seatGenerator
    ) {
        $exists = Voucher::query()
            ->where('flight_number', $request->flightNumber)
            ->whereDate('flight_date', $request->date)
            ->exists();

        if ($exists) {
            throw new VoucherAlreadyExistsException();
        }

        $seats = $seatGenerator->generate($request->aircraft);

        $voucher = Voucher::create([
            'crew_name' => $request->name,
            'crew_id' => $request->id,
            'flight_number' => $request->flightNumber,
            'flight_date' => $request->date,
            'aircraft_type' => $request->aircraft,
            'seat1' => $seats[0],
            'seat2' => $seats[1],
            'seat3' => $seats[2],
        ]);

        return new VoucherResource($voucher);
    }
}
