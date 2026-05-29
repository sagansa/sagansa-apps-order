<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PublicStorageUrl
{
    public static function from(?string $path, ?string $fallback = null): ?string
    {
        if (! $path) {
            return $fallback;
        }

        $path = trim($path);

        if (Str::startsWith($path, ['http://', 'https://'])) {
            $parsed = parse_url($path);
            $host = $parsed['host'] ?? '';

            if (! in_array($host, ['localhost', '127.0.0.1'], true)) {
                return $path;
            }

            $path = $parsed['path'] ?? '';
        }

        $path = ltrim($path, '/');

        if (Str::startsWith($path, 'storage/')) {
            $path = Str::after($path, 'storage/');
        }

        return Storage::disk('public')->url($path);
    }
}
