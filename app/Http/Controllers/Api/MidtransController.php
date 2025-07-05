<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;
use App\Models\SalesOrder;
use Illuminate\Support\Facades\Log;

class MidtransController extends Controller
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function generateSnapToken(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:sales_orders,id',
            'amount' => 'required|numeric|min:0',
            'customer_details' => 'required|array',
            'customer_details.first_name' => 'required|string',
            'customer_details.email' => 'required|email',
            'customer_details.phone' => 'required|string',
        ]);

        $salesOrder = SalesOrder::find($request->order_id);

        if (!$salesOrder) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        // Prepare Midtrans parameters
        $params = [
            'transaction_details' => [
                'order_id' => $salesOrder->id,
                'gross_amount' => $request->amount,
            ],
            'customer_details' => $request->customer_details,
            // You can add item_details here if needed
            // 'item_details' => [
            //     [
            //         'id' => 'ITEM001',
            //         'price' => 10000,
            //         'quantity' => 1,
            //         'name' => 'Product Name',
            //     ]
            // ]
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            $salesOrder->midtrans_snap_token = $snapToken;
            $salesOrder->midtrans_transaction_id = null; // Reset transaction ID for new attempt
            $salesOrder->midtrans_status = 'pending_payment'; // Set initial status
            $salesOrder->save();

            return response()->json(['snap_token' => $snapToken]);
        } catch (\Exception $e) {
            Log::error('Midtrans Snap Token Generation Error: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to generate Snap Token', 'error' => $e->getMessage()], 500);
        }
    }

    public function midtransCallback(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');
        $hashed = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashed != $request->signature_key) {
            return response()->json(['message' => 'Invalid signature key'], 403);
        }

        $transaction = $request->transaction_status;
        $type = $request->payment_type;
        $orderId = $request->order_id;
        $fraud = $request->fraud_status;

        $salesOrder = SalesOrder::find($orderId);

        if (!$salesOrder) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $salesOrder->midtrans_transaction_id = $request->transaction_id;

        if ($transaction == 'capture') {
            // For credit card transaction,
            // 'capture' is only used for those that are 'authorize' status
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    $salesOrder->midtrans_status = 'challenge';
                } else {
                    $salesOrder->midtrans_status = 'settlement';
                    $salesOrder->status = 'paid'; // Update your order status
                }
            }
        } elseif ($transaction == 'settlement') {
            $salesOrder->midtrans_status = 'settlement';
            $salesOrder->status = 'paid'; // Update your order status
        } elseif ($transaction == 'pending') {
            $salesOrder->midtrans_status = 'pending';
        } elseif ($transaction == 'deny') {
            $salesOrder->midtrans_status = 'deny';
            $salesOrder->status = 'cancelled'; // Update your order status
        } elseif ($transaction == 'expire') {
            $salesOrder->midtrans_status = 'expire';
            $salesOrder->status = 'cancelled'; // Update your order status
        } elseif ($transaction == 'cancel') {
            $salesOrder->midtrans_status = 'cancel';
            $salesOrder->status = 'cancelled'; // Update your order status
        }

        $salesOrder->save();

        return response()->json(['message' => 'Callback processed successfully']);
    }
}
