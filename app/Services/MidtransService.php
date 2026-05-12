<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    protected $merchantId;
    protected $serverKey;
    protected $isProduction;
    protected $isSanitized;
    protected $is3ds;

    public function __construct()
    {
        $this->merchantId = config('services.midtrans.merchant_id');
        $this->serverKey = config('services.midtrans.server_key');
        $this->isProduction = config('services.midtrans.is_production');
        $this->isSanitized = config('services.midtrans.is_sanitized');
        $this->is3ds = config('services.midtrans.is_3ds');

        $this->_configureMidtrans();
    }

    public function _configureMidtrans()
    {
        Config::$serverKey = $this->serverKey;
        Config::$merchantId = $this->merchantId;
        Config::$isProduction = $this->isProduction;
        Config::$isSanitized = $this->isSanitized;
        Config::$is3ds = $this->is3ds;
    }

    public function getSnapToken($order)
    {
        $adminFee = (int) $order->admin_fee;
        
        $params = [
            'transaction_details' => [
                'order_id' => $order->id . '-' . time(),
                'gross_amount' => (int) $order->total_price,
            ],
            'customer_details' => [
                'first_name' => $order->user->name,
                'email' => $order->user->email,
                'phone' => $order->user->phone ?? '',
            ],
            'item_details' => $this->getItemDetails($order, $adminFee),
        ];

        // Map internal keys to Midtrans enabled_payments
        $paymentMapping = [
            'bca_va' => ['bca_va'],
            'mandiri_va' => ['echannel'],
            'bni_va' => ['bni_va'],
            'bri_va' => ['bri_va'],
            'permata_va' => ['permata_va'],
            'other_va' => ['other_va'],
            'qris' => ['qris'],
            'gopay' => ['gopay'],
            'shopeepay' => ['shopeepay'],
            'credit_card' => ['credit_card'],
        ];

        if (isset($paymentMapping[$order->payment_method])) {
            $params['enabled_payments'] = $paymentMapping[$order->payment_method];
        }

        try {
            // Log only the first 5 characters of the server key for debugging (security safe)
            $keyPrefix = substr(config('services.midtrans.server_key'), 0, 5);
            \Illuminate\Support\Facades\Log::info('Attempting Snap Token generation:', [
                'merchant_id' => config('services.midtrans.merchant_id'),
                'server_key_prefix' => $keyPrefix . '...',
                'gross_amount' => $params['transaction_details']['gross_amount']
            ]);

            $snapToken = Snap::getSnapToken($params);
            return $snapToken;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Midtrans Snap Generation Error:', [
                'message' => $e->getMessage(),
                'server_key_prefix' => substr(config('services.midtrans.server_key'), 0, 5) . '...',
            ]);
            throw new \Exception("Midtrans Error: " . $e->getMessage());
        }
    }

    private function getItemDetails($order, $adminFee)
    {
        $items = [];

        foreach ($order->detailSalesOrders as $detail) {
            // Sanitize name: remove non-alphanumeric except space, dot, comma, dash
            $name = $detail->product->name ?? 'Produk';
            $cleanName = preg_replace('/[^a-zA-Z0-0\s\.,\-]/', '', $name);

            $items[] = [
                'id' => $detail->product_id,
                'price' => (int) $detail->unit_price,
                'quantity' => $detail->quantity,
                'name' => substr($cleanName, 0, 50),
            ];
        }

        if ($order->shipping_cost > 0) {
            $items[] = [
                'id' => 'shipping',
                'price' => (int) $order->shipping_cost,
                'quantity' => 1,
                'name' => 'Biaya Pengiriman',
            ];
        }

        if ($adminFee > 0) {
            $items[] = [
                'id' => 'admin_fee',
                'price' => (int) $adminFee,
                'quantity' => 1,
                'name' => 'Biaya Layanan/Admin',
            ];
        }

        return $items;
    }
}
