<?php

namespace App\Services;

use InvalidArgumentException;

class SeatGeneratorService
{
    /**
     * Generate 3 unique random seats based on aircraft type.
     */
    public function generate(string $aircraft): array
    {
        $availableSeats = $this->getAvailableSeats($aircraft);

        shuffle($availableSeats);

        return array_slice($availableSeats, 0, 3);
    }

    /**
     * Get all available seats for an aircraft.
     */
    protected function getAvailableSeats(string $aircraft): array
    {
        return match ($aircraft) {
            'ATR' => $this->buildSeats(18, ['A', 'C', 'D', 'F']),
            'Airbus 320' => $this->buildSeats(32, ['A', 'B', 'C', 'D', 'E', 'F']),
            'Boeing 737 Max' => $this->buildSeats(32, ['A', 'B', 'C', 'D', 'E', 'F']),
            default => throw new InvalidArgumentException('Invalid aircraft type.'),
        };
    }

    /**
     * Build seat map.
     */
    protected function buildSeats(int $rows, array $columns): array
    {
        $seats = [];

        for ($row = 1; $row <= $rows; $row++) {
            foreach ($columns as $column) {
                $seats[] = $row . $column;
            }
        }

        return $seats;
    }
}