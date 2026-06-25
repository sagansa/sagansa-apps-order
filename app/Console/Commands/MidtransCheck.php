<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

/**
 * Diagnose the Midtrans payment-notification callback end-to-end.
 *
 * It builds a valid transaction-notification payload, signs it with the SAME
 * server key the app uses (so the signature MUST validate), then posts it to
 * the callback URL and reports the response.
 *
 * Usage:
 *   php artisan midtrans:check
 *   php artisan midtrans:check --url=https://order.sagansa.id/midtrans/callback
 *
 * Expected result when the callback is healthy:
 *   HTTP 200  -> order updated (use a real order id)
 *   HTTP 404  -> signature validated, but the order id was not found in DB
 *                (this STILL PROVES the signature check is working!)
 *   HTTP 403  -> signature failed -> key mismatch (the ONLY failure case)
 */
class MidtransCheck extends Command
{
    protected $signature = 'midtrans:check
                            {--url= : Callback URL to test (defaults to app URL + /midtrans/callback)}
                            {--order-id=10505 : Internal SalesOrder id to put in the payload}';

    protected $description = 'Sign a sample Midtrans notification with the app server key and post it to the callback to verify signature handling.';

    public function handle(): int
    {
        $serverKey = config('services.midtrans.server_key');
        $isProd    = config('services.midtrans.is_production');

        if (! $serverKey) {
            $this->error('services.midtrans.server_key is empty. Check .env / config/services.php.');
            return self::FAILURE;
        }

        $url = $this->option('url') ?: rtrim((string) config('app.url'), '/') . '/midtrans/callback';
        $orderId = $this->option('order-id') . '-' . time();

        // Build a realistic Midtrans transaction notification body.
        $payload = [
            'transaction_time'    => now()->format('Y-m-d H:i:s'),
            'transaction_status'  => 'settlement',
            'transaction_id'      => 'test-' . uniqid(),
            'status_message'      => 'midtrans payment notification',
            'status_code'         => '200',
            'payment_type'        => 'bank_transfer',
            'order_id'            => $orderId,
            'merchant_id'         => (string) config('services.midtrans.merchant_id'),
            'gross_amount'        => '10000.00',
            'fraud_status'        => 'accept',
            'currency'            => 'IDR',
        ];

        // Midtrans signature for transaction notifications:
        // SHA512(order_id + status_code + gross_amount + server_key)
        $payload['signature_key'] = hash('sha512',
            $payload['order_id'] . $payload['status_code'] . $payload['gross_amount'] . $serverKey
        );

        $this->info('App server key (first 12): ' . substr($serverKey, 0, 12) . '…');
        $this->info('is_production: ' . var_export($isProd, true));
        $this->info('Testing URL: ' . $url);
        $this->info('order_id in payload: ' . $orderId);
        $this->newLine();

        try {
            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->timeout(20)
                ->post($url, $payload);
        } catch (\Throwable $e) {
            $this->error('Request failed: ' . $e->getMessage());
            return self::FAILURE;
        }

        $code = $response->status();
        $body = $response->body();

        $this->line('Response HTTP: ' . $code);
        $this->line('Response body: ' . $body);
        $this->newLine();

        return match (true) {
            $code === 200 => $this->reportOk('Callback accepted the notification (200). If the order id exists it was updated; otherwise it was acknowledged with a warning log.'),
            $code === 404 => tap(self::FAILURE, fn() => $this->error('Got 404 — order-not-found still returns 404. Deploy the latest controller change (it should now return 200).')),
            $code === 403 => tap(self::FAILURE, fn() => $this->error('Signature FAILED (403). The server key the app uses does NOT match the key Midtrans signs with for this environment.')),
            default       => tap(self::FAILURE, fn() => $this->error("Unexpected status $code.")),
        };
    }

    private function reportOk(string $message): int
    {
        $this->info('✅ ' . $message);
        return self::SUCCESS;
    }
}
