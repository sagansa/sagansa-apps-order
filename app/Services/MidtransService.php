<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\CoreApi;
use Illuminate\Support\Facades\Log;

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
        Config::$isProduction = $this->isProduction;
        Config::$isSanitized = $this->isSanitized;
        Config::$is3ds = $this->is3ds;
    }

    public function chargeCoreApi($order, $paymentMethod, $cardToken = null)
    {
        $this->_configureMidtrans();

        $params = [
            'transaction_details' => [
                'order_id' => $order->id . '-' . time(),
                'gross_amount' => (int) $order->total_price,
            ],
            'customer_details' => [
                'first_name' => $order->orderedBy->name ?? '',
                'email' => $order->orderedBy->email ?? '',
                'phone' => $order->orderedBy->phone ?? '',
            ],
            'item_details' => $this->getItemDetails($order, (int) $order->admin_fee),
        ];

        $paymentType = $this->getPaymentType($paymentMethod);

        if ($paymentType === 'credit_card') {
            $params['payment_type'] = 'credit_card';
            $params['credit_card'] = [
                'token_id' => $cardToken,
            ];
        } elseif ($paymentType === 'bank_transfer') {
            $bank = $this->getBankName($paymentMethod);
            $params['payment_type'] = 'bank_transfer';

            if ($bank === 'mandiri') {
                $params['payment_type'] = 'echannel';
                $params['echannel'] = ['bill_info1' => 'Payment', 'bill_info2' => 'Order'];
            } elseif ($bank === 'permata') {
                $params['payment_type'] = 'permata_va';
            } else {
                $params['bank_transfer'] = ['bank' => $bank];
            }
        } else {
            $params['payment_type'] = $paymentType;
        }

        try {
            $keyPrefix = substr(config('services.midtrans.server_key'), 0, 5);
            Log::info('Midtrans Core API Charge:', [
                'merchant_id' => config('services.midtrans.merchant_id'),
                'server_key_prefix' => $keyPrefix . '...',
                'payment_type' => $params['payment_type'],
                'gross_amount' => $params['transaction_details']['gross_amount'],
                'full_params' => json_encode($params),
            ]);

            $apiUrl = config('services.midtrans.is_production')
                ? 'https://api.midtrans.com/v2/charge'
                : 'https://api.sandbox.midtrans.com/v2/charge';

            $client = new \GuzzleHttp\Client();
            $httpResponse = $client->post($apiUrl, [
                'headers' => [
                    'Authorization' => 'Basic ' . base64_encode(config('services.midtrans.server_key') . ':'),
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ],
                'json' => $params,
            ]);

            $responseBody = (string) $httpResponse->getBody();
            $response = json_decode($responseBody);

            Log::info('Midtrans Core API Response:', ['response' => $responseBody]);

            if (isset($response->status_code) && $response->status_code >= 400 && $response->status_code != 407) {
                throw new \Exception('Midtrans Error: ' . ($response->status_message ?? 'Unknown error'));
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('Midtrans Core API Error:', [
                'message' => $e->getMessage(),
                'payment_method' => $paymentMethod,
                'token_id' => $cardToken,
            ]);
            throw new \Exception('Midtrans Error: ' . $e->getMessage());
        }
    }

    private function getPaymentType($paymentMethod)
    {
        $map = [
            'bca_va' => 'bank_transfer',
            'mandiri_va' => 'bank_transfer',
            'bni_va' => 'bank_transfer',
            'bri_va' => 'bank_transfer',
            'permata_va' => 'bank_transfer',
            'other_va' => 'bank_transfer',
            'qris' => 'qris',
            'gopay' => 'gopay',
            'shopeepay' => 'shopeepay',
            'credit_card' => 'credit_card',
        ];
        return $map[$paymentMethod] ?? 'bank_transfer';
    }

    private function getBankName($paymentMethod)
    {
        $map = [
            'bca_va' => 'bca',
            'mandiri_va' => 'mandiri',
            'bni_va' => 'bni',
            'bri_va' => 'bri',
            'permata_va' => 'permata',
            'other_va' => 'other',
        ];
        return $map[$paymentMethod] ?? 'bca';
    }

    private function getItemDetails($order, $adminFee)
    {
        $items = [];

        foreach ($order->detailSalesOrders as $detail) {
            // Sanitize name: remove non-alphanumeric except space, dot, comma, dash
            $name = $detail->product->name ?? 'Produk';
            $cleanName = preg_replace('/[^a-zA-Z0-9\s\.,\-]/', '', $name);

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
