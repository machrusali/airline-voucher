<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GenerateVoucherRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation rules.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'id' => ['required', 'string', 'max:50'],
            'flightNumber' => ['required', 'string', 'max:20'],
            'date' => ['required', 'date'],
            'aircraft' => [
                'required',
                'in:ATR,Airbus 320,Boeing 737 Max',
            ],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Crew name is required.',
            'id.required' => 'Crew ID is required.',
            'flightNumber.required' => 'Flight number is required.',
            'date.required' => 'Flight date is required.',
            'aircraft.required' => 'Aircraft type is required.',
            'aircraft.in' => 'Selected aircraft type is invalid.',
        ];
    }
}