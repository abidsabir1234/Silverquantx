<?php

namespace App\Support;

class Formatting
{
    /** "0.4200" -> "$0.42/hr" — trims trailing zeros but never below 2 decimal places. */
    public static function hourlyRate(string|float $value): string
    {
        $formatted = number_format((float) $value, 4, '.', '');
        [$intPart, $decPart] = explode('.', $formatted);

        while (strlen($decPart) > 2 && str_ends_with($decPart, '0')) {
            $decPart = substr($decPart, 0, -1);
        }

        return "\${$intPart}.{$decPart}/hr";
    }

    /** "$0.42/hr" -> 0.42 — reverses hourlyRate() for admin-entered free-text rates. */
    public static function parseRate(string $input): float
    {
        preg_match('/[\d.]+/', $input, $matches);

        return isset($matches[0]) ? (float) $matches[0] : 0.0;
    }
}
