<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\DeliveryService;
use App\Models\DeliveryAddress;
use App\Models\TransferToAccount;
use App\Models\SalesOrder;
use App\Models\DetailSalesOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log; // Import Log facade
use Illuminate\Support\Facades\URL; // Import URL facade
use Midtrans\Config;
use Midtrans\Snap;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = Cart::with(['product.priceTiers', 'product.unit'])
            ->where('user_id', $request->user()->id)
                ->get();

        $deliveryServices = DeliveryService::all();

        $deliveryAddresses = DeliveryAddress::with(['province', 'city', 'district', 'subdistrict', 'postalCode'])
            ->where('user_id', $request->user()->id)
                ->get();

        $transferToAccounts = TransferToAccount::with('bank')->get();

            return Inertia::render('Cart', [
            'cartItems' => $cartItems,
            'deliveryServices' => $deliveryServices,
            'deliveryAddresses' => $deliveryAddresses,
            'transferToAccounts' => $transferToAccounts,
        ]);
    }

    public function update(Request $request, Cart $cart)
    {
        if ($cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart->update([
            'quantity' => $request->quantity
        ]);

        return back();
    }

    public function destroy(Request $request, Cart $cart)
    {
        if ($cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $cart->delete();
        return back();
    }

    public function store(Request $request)
    {
            $request->validate([
                'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        // Cek apakah produk sudah ada di keranjang
        $existingCart = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingCart) {
            // Update quantity jika produk sudah ada
            $existingCart->update([
                'quantity' => $existingCart->quantity + $request->quantity
            ]);
        } else {
            // Buat cart baru jika produk belum ada
            Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang!');
    }

    public function checkout(Request $request)
    {
        return DB::transaction(function () use ($request) {
            // Validasi Dasar
            $validated = $request->validate([
                'delivery_service_id' => 'required|exists:delivery_services,id',
                // delivery_address_id dan transfer_to_account_id divalidasi kondisional setelah ini
                'delivery_address_id' => 'nullable|exists:delivery_addresses,id',
                'transfer_to_account_id' => 'nullable|exists:transfer_to_accounts,id',
                'delivery_date' => 'required|date|after_or_equal:today',
                // image_payment divalidasi kondisional
                'image_payment' => 'nullable|image|max:2048',
                // shipping_cost divalidasi kondisional
                'shipping_cost' => 'nullable|numeric|min:0',
                'payment_status' => 'required|integer|in:1,4,5', // Add status 5 for Midtrans pending
                'payment_method' => 'required|string|in:manual_transfer,midtrans', // Add payment_method validation
                'shipping_payment_method' => 'nullable|string|in:via_us,to_courier', // Add shipping_payment_method validation
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
            ]);

            // Ensure these keys exist in validated array, even if null
            $validated['transfer_to_account_id'] = $validated['transfer_to_account_id'] ?? null;
            $validated['image_payment'] = $validated['image_payment'] ?? null;
            $validated['shipping_payment_method'] = $validated['shipping_payment_method'] ?? null;

            $isSelfPickup = $validated['delivery_service_id'] == 33;
            $paymentStatus = $validated['payment_status'];
            $paymentMethod = $validated['payment_method'];
            $shippingPaymentMethod = $validated['shipping_payment_method'] ?? null; // Get shipping_payment_method
            $shippingCost = $validated['shipping_cost'] ?? 0;

            // Ensure transfer_to_account_id is null if payment method is Midtrans
            if ($paymentMethod === 'midtrans') {
                $validated['transfer_to_account_id'] = null;
            }

            // Validasi Kondisional berdasarkan Metode Pengiriman dan Status Pembayaran
            if (!$isSelfPickup) { // Metode Pengiriman: Selain Ambil Sendiri
                // Wajib ada alamat pengiriman
                if (empty($validated['delivery_address_id'])) {
                    return back()->withErrors(['delivery_address_id' => 'Alamat pengiriman wajib dipilih untuk metode pengiriman ini.']);
                }

                // If payment_status is 1 (paid)
                if ($paymentStatus == 1) {
                    // If shipping_payment_method is 'via_us' AND shippingCost > 0, then transfer details are required.
                    if ($shippingPaymentMethod === 'via_us' && $shippingCost > 0) {
                        if (empty($validated['transfer_to_account_id'])) {
                            return back()->withErrors(['transfer_to_account_id' => 'Rekening tujuan transfer wajib dipilih.']);
                        }
                        if (!$request->hasFile('image_payment')) {
                            return back()->withErrors(['image_payment' => 'Bukti transfer wajib diupload untuk pembayaran via kami.']);
                        }
                    }
                    // If shipping_payment_method is 'to_courier' or shippingCost is 0, no transfer details are required.
                    // The frontend sets payment_status to 1 for 'to_courier' as it's considered paid from system perspective.
                } elseif ($paymentStatus == 4) { // Delivery + Shipping Cost Not Confirmed (Status 4)
                    // No transfer account or proof required at this stage
                    $shippingCost = 0; // Ensure it's stored as 0 if status is 4
                    $validated['transfer_to_account_id'] = null; // Ensure null in backend
                    $validated['image_payment'] = null; // Ensure null in backend
                }
            } else { // Delivery Method: Self-Pickup (isSelfPickup = true, ID 33)
                // No delivery address required
                $validated['delivery_address_id'] = null; // Ensure null in backend

                // Transfer account is required for self-pickup
                if (empty($validated['transfer_to_account_id'])) {
                    return back()->withErrors(['transfer_to_account_id' => 'Rekening tujuan transfer wajib dipilih untuk metode ambil sendiri.']);
                }

                if ($paymentStatus == 1) { // Self-Pickup + Proof Uploaded (Status 1)
                    // Proof of transfer is required if status is 1
                    if (!$request->hasFile('image_payment')) {
                        return back()->withErrors(['image_payment' => 'Bukti transfer wajib diupload untuk status pembayaran ini.']);
                    }
                } elseif ($paymentStatus == 4) { // Self-Pickup + Proof Not Uploaded (Status 4)
                    // No transfer proof required at this stage
                    $validated['image_payment'] = null; // Ensure null in backend
                }
                $shippingCost = 0;
            }

            // Hitung Subtotal dan Total Price
            $subtotal = array_reduce($validated['items'], function ($sum, $item) {
                return $sum + ($item['quantity'] * $item['price']);
            }, 0);

            // Total price dihitung dari subtotal + shipping_cost yang sudah disesuaikan
            $totalPrice = $subtotal + $shippingCost;

            $imagePaymentPath = null;
            // Hanya simpan file jika ada dan validasinya lolos (status 1)
            if ($paymentStatus == 1 && $request->hasFile('image_payment')) {
                $imagePaymentPath = $request->file('image_payment')->store('payments', 'public');
            }

            $order = SalesOrder::create([
                'ordered_by_id' => $request->user()->id,
                'delivery_service_id' => $validated['delivery_service_id'],
                'delivery_address_id' => $validated['delivery_address_id'],
                'transfer_to_account_id' => $validated['transfer_to_account_id'],
                'delivery_date' => $validated['delivery_date'],
                'total_price' => $totalPrice,
                'shipping_cost' => $shippingCost, // Gunakan nilai shippingCost yang sudah disesuaikan
                'payment_status' => $paymentStatus, // Gunakan paymentStatus dari frontend
                'delivery_status' => '1', // Status awal pesanan (misal: diproses)
                'image_payment' => $imagePaymentPath,
            ]);

            foreach ($validated['items'] as $item) {
                DetailSalesOrder::create([
                    'sales_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal_price' => $item['quantity'] * $item['price'],
                ]);
            }

            Cart::where('user_id', $request->user()->id)->delete();

            // Eager load relationships for the newly created order
            $order->load([
                'orderedBy',
                'deliveryService',
                'deliveryAddress.province',
                'deliveryAddress.city',
                'deliveryAddress.district',
                'deliveryAddress.subdistrict',
                'transferToAccount.bank',
                'detailSalesOrders.product.unit'
            ]);

            if ($paymentMethod === 'midtrans') {
                // Set Midtrans configuration
                Config::$serverKey = config('services.midtrans.server_key');
                Config::$isProduction = config('services.midtrans.is_production');
                Config::$isSanitized = true;
                Config::$is3ds = true;

                $midtrans_params = [
                    'transaction_details' => [
                        'order_id' => $order->id,
                        'gross_amount' => $totalPrice,
                    ],
                    'customer_details' => [
                        'first_name' => $request->user()->name,
                        'email' => $request->user()->email,
                    ],
                    'enabled_payments' => ['gopay', 'shopeepay', 'bank_transfer'],
                    'vtweb' => []
                ];

                $snapToken = Snap::getSnapToken($midtrans_params);
                $order->midtrans_snap_token = $snapToken;
                $order->save();

                return response()->json(['snap_token' => $snapToken]);
            }

            // Prepare order details for WhatsApp message
            $orderDetails = [
                'order_id' => $order->id,
                'order_number' => substr(md5((string)$order->total_price . (string)$order->id . (string)$order->created_at), 0, 8), // Generate order number
                'customer_name' => $order->orderedBy->name,
                'total_amount' => $order->total_price,
                'delivery_method' => $order->deliveryService->name,
                'payment_status' => $order->payment_status,
                'delivery_status' => $order->delivery_status,
                'shipping_cost' => $order->shipping_cost,
                'delivery_date' => $order->delivery_date,
                'products' => $order->detailSalesOrders->map(function ($detail) {
                    return [
                        'name' => $detail->product->name,
                        'quantity' => $detail->quantity,
                        'unit' => $detail->product->unit->unit ?? 'unit',
                        'price' => $detail->unit_price,
                        'subtotal' => $detail->subtotal_price,
                    ];
                }),
                'delivery_address' => $order->deliveryAddress ? [
                    'name' => $order->deliveryAddress->name,
                    'recipient_name' => $order->deliveryAddress->recipient_name,
                    'recipient_telp_no' => $order->deliveryAddress->recipient_telp_no,
                    'address' => $order->deliveryAddress->address,
                    'subdistrict' => $order->deliveryAddress->subdistrict->name ?? '',
                    'district' => $order->deliveryAddress->district->name ?? '',
                    'city' => $order->deliveryAddress->city->name ?? '',
                    'province' => $order->deliveryAddress->province->name ?? '',
                    'postal_code' => $order->deliveryAddress->postalCode->postal_code ?? '',
                ] : null,
                'transfer_account' => $order->transferToAccount ? [
                    'bank_name' => $order->transferToAccount->bank->name ?? '',
                    'account_number' => $order->transferToAccount->number,
                    'account_name' => $order->transferToAccount->name,
                ] : null,
            ];

            // Logika pesan redirect berdasarkan payment_status
            $message = ($order->payment_status == 4)
                ? 'Pesanan berhasil dibuat! Admin akan segera menghubungi Anda untuk konfirmasi biaya ongkos kirim dan total pembayaran.'
                : ($isSelfPickup
                    ? 'Pesanan berhasil dibuat dan segera diproses! Silakan lakukan pembayaran atau ambil pesanan di toko kami sesuai dengan tanggal yang telah ditentukan.'
                    : 'Pesanan berhasil dibuat dan segera diproses! Silakan lakukan pembayaran sesuai instruksi.');

            $order->load(['transferToAccount.bank']); // Ensure transferToAccount and bank are loaded for frontend display

            return Inertia::render('CheckoutSuccess', [
                'deliveryType' => $isSelfPickup ? 'self_pickup' : 'delivery',
                'message' => $message,
                'salesOrder' => $order, // Pass the salesOrder object directly
                'paymentMethod' => $paymentMethod, // Pass the selected payment method
                'order_details_for_whatsapp' => $orderDetails, // Pass directly as a prop
            ])->with([
                'success' => 'Pesanan berhasil dibuat!',
            ]);
        });
    }

    // New method to handle Midtrans callback
    public function midtransCallback(Request $request)
    {
        $serverKey = config('midtrans.server_key');
        $hashed = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashed != $request->signature_key) {
            return response()->json(['message' => 'Invalid signature key'], 403);
        }

        $order = SalesOrder::where('id', $request->order_id)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($request->transaction_status == 'capture') {
            if ($request->fraud_status == 'challenge') {
                $order->payment_status = 2; // Challenge
            } else if ($request->fraud_status == 'accept') {
                $order->payment_status = 1; // Success
            }
        } else if ($request->transaction_status == 'settlement') {
            $order->payment_status = 1; // Success
        } else if ($request->transaction_status == 'pending') {
            $order->payment_status = 5; // Pending
        } else if ($request->transaction_status == 'deny') {
            $order->payment_status = 0; // Deny
        } else if ($request->transaction_status == 'expire') {
            $order->payment_status = 0; // Expire
        } else if ($request->transaction_status == 'cancel') {
            $order->payment_status = 0; // Cancel
        }

        $order->save();

        return response()->json(['message' => 'OK'], 200);
    }
}
