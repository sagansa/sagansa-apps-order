<?php

namespace App\Console\Commands;

use App\Models\SalesOrder;
use Illuminate\Console\Command;

class CancelExpiredPayments extends Command
{
    protected $signature = 'orders:cancel-expired
                            {--dry-run : Preview orders that would be cancelled without making changes}';

    protected $description = 'Cancel unpaid Midtrans payments whose expiry_time has passed';

    public function handle(): int
    {
        $orders = SalesOrder::where('payment_status', 4)
            ->where('payment_method', '!=', 'manual_transfer')
            ->whereNotNull('midtrans_response')
            ->whereNotIn('midtrans_status', ['settlement', 'capture', 'expire'])
            ->get();

        $cancelled = 0;

        foreach ($orders as $order) {
            $response = json_decode($order->midtrans_response, true);
            if (!isset($response['expiry_time'])) {
                continue;
            }

            $expiryTime = strtotime($response['expiry_time']);
            if ($expiryTime === false || $expiryTime > time()) {
                continue;
            }

            $cancelled++;

            if ($this->option('dry-run')) {
                $this->line("[DRY RUN] Would cancel order #{$order->id} ({$order->order_number}) - expired at {$response['expiry_time']}");
                continue;
            }

            $order->midtrans_status = 'expire';
            $order->payment_status = 3;
            $order->save();

            $this->line("Cancelled order #{$order->id} ({$order->order_number})");
        }

        $this->info("Processed {$cancelled} expired order(s).");

        return self::SUCCESS;
    }
}
