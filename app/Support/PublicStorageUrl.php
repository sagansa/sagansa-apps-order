<?php

namespace App\Support;

use Illuminate\Support\Str;

class PublicStorageUrl
{
    public static function from(?string $path, ?string $fallback = null): ?string
    {
        if (! $path) {
            return $fallback;
        }

        $path = trim($path);

        // Sebagian path lama tersimpan dengan slash ter-escape (contoh:
        // "images\/InvoicePurchase\/x.webp" — warisan bug mobile saat path
        // dikirim dari body JSON mentah). Normalisasi: backslash jadi slash,
        // lalu slash beruntun diringkas menjadi satu.
        $path = str_replace('\\', '/', $path);
        $path = preg_replace('#/{2,}#', '/', $path);

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

        // Disajikan dari image service (img.sagansa.id/storage/...).
        $imgBaseUrl = rtrim(env('IMG_SERVICE_URL', 'https://img.sagansa.id'), '/');

        return "{$imgBaseUrl}/storage/{$path}";
    }
}
