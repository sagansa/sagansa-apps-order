<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MidtransController extends Controller
{
    public function midtransCallback(Request $request)
    {
        Log::info('Midtrans Callback Received:', $request->all());

        $serverKey = config('services.midtrans.server_key');
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashed !== $request->signature_key) {
            Log::error('Midtrans Callback: Invalid Signature');
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        $parts = explode('-', $request->order_id);
        $orderId = $parts[0] ?? null;

        if (!$orderId || !is_numeric($orderId)) {
            Log::warning('Midtrans Callback: Invalid order_id format', ['order_id' => $request->order_id]);
            return response()->json(['message' => 'Invalid order_id format'], 400);
        }

        $order = SalesOrder::find($orderId);

        if (!$order) {
            Log::warning('Midtrans Callback: Order Not Found (acknowledging) - ' . $orderId, [
                'midtrans_order_id' => $request->order_id,
                'transaction_status' => $request->transaction_status,
            ]);
            return response()->json(['message' => 'Order not found']);
        }

        $transactionStatus = $request->transaction_status;
        $type = $request->payment_type;
        $fraud = $request->fraud_status;

        $order->midtrans_transaction_id = $request->transaction_id;
        $order->midtrans_status = $transactionStatus;
        $order->midtrans_response = json_encode($request->all());

        if ($type) {
            $order->midtrans_payment_type = $type;
        }

        if ($transactionStatus == 'capture') {
            if ($fraud == 'challenge') {
                $order->payment_status = 4;
                $order->status = 'challenge';
            } else {
                $order->payment_status = 2;
                $order->status = 'paid';
            }
        } elseif ($transactionStatus == 'settlement') {
            $order->payment_status = 2;
            $order->status = 'paid';
        } elseif ($transactionStatus == 'pending') {
            $order->payment_status = 4;
            $order->status = 'pending';
        } elseif ($transactionStatus == 'deny' || $transactionStatus == 'expire' || $transactionStatus == 'cancel') {
            $order->payment_status = 3;
            $order->status = 'cancelled';
        } elseif ($transactionStatus == 'refund' || $transactionStatus == 'partial_refund') {
            $order->payment_status = 3;
            $order->status = 'cancelled';
        }

        $order->save();

        Log::info('Midtrans Callback: Order ' . $orderId . ' updated to status ' . $order->payment_status);

        return response()->json(['message' => 'Success']);
    }

    public function midtransRecurring(Request $request)
    {
        Log::info('Midtrans Recurring Notification (unused feature):', $request->all());
        return response('OK', 200);
    }

    public function midtransAccountLinking(Request $request)
    {
        Log::info('Midtrans Account Linking Notification (unused feature):', $request->all());
        return response('OK', 200);
    }
}
