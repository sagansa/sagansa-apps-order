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
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class CartController extends Controller
{
    private function cartUserId(Request $request): int
    {
        return $request->user()->id;
    }

    public function index(Request $request)
    {
        $cartUserId = $this->cartUserId($request);

        $cartItems = Cart::with(['product.priceTiers', 'product.unit'])
            ->where('user_id', $cartUserId)
            ->get();

        $deliveryServices = DeliveryService::all();
        $deliveryAddresses = DeliveryAddress::with(['province', 'city', 'district', 'subdistrict', 'postalCode'])
            ->where('user_id', $cartUserId)
            ->get();
            
        // Add information about whether address has been used in orders
        $deliveryAddresses->each(function ($address) {
            $address->is_used_in_orders = $address->salesOrders()->count() > 0;
        });
        $transferToAccounts = TransferToAccount::with('bank')->get();
        $midtransMethods = config('services.midtrans.fees');

        return Inertia::render('Cart', [
            'cartItems' => $cartItems,
            'deliveryServices' => $deliveryServices,
            'deliveryAddresses' => $deliveryAddresses,
            'transferToAccounts' => $transferToAccounts,
            'midtransMethods' => $midtransMethods,
        ]);
    }

    public function update(Request $request, Cart $cart)
    {
        if ($cart->user_id != $this->cartUserId($request)) {
            abort(403);
        }
        $request->validate(['quantity' => 'required|integer|min:1']);
        $cart->update(['quantity' => $request->quantity]);
        return back();
    }

    public function destroy(Request $request, Cart $cart)
    {
        if ($cart->user_id != $this->cartUserId($request)) {
            abort(403);
        }
        $cart->delete();
        return back();
    }

    public function store(Request $request)
    {
        $cartUserId = $this->cartUserId($request);

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $existingCart = Cart::where('user_id', $cartUserId)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingCart) {
            $existingCart->increment('quantity', $request->quantity);
        } else {
            Cart::create([
                'user_id' => $cartUserId,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang!');
    }

    public function checkout(Request $request)
    {
        Log::info('Checkout POST Request Received:', $request->all());

        try {
            return DB::transaction(function () use ($request) {
                Log::info('Starting checkout transaction.');

                $validated = $request->validate([
                    'delivery_service_id' => 'required|exists:delivery_services,id',
                    'delivery_address_id' => 'nullable|exists:delivery_addresses,id,user_id,' . $this->cartUserId($request),
                    'transfer_to_account_id' => 'nullable|exists:transfer_to_accounts,id',
                    'delivery_date' => 'required|date|after_or_equal:today',
                    'image_payment' => 'nullable|image|max:2048',
                    'shipping_cost' => 'nullable|numeric|min:0',
                    'payment_status' => 'required|integer|in:1,4,5',
                    'payment_method' => 'required|string|in:manual_transfer,bca_va,mandiri_va,bni_va,bri_va,permata_va,other_va,qris,gopay,shopeepay,credit_card',
                    'shipping_payment_method' => 'nullable|string|in:via_us,to_courier',
                    'items' => 'required|array|min:1',
                    'items.*.product_id' => 'required|exists:products,id',
                    'items.*.quantity' => 'required|integer|min:1',
                    'items.*.price' => 'required|numeric|min:0',
                ]);

                Log::info('Validation successful.', $validated);

                // Initialize variables from validated data
                $isSelfPickup = $validated['delivery_service_id'] == 33;
                $shippingCost = $validated['shipping_cost'] ?? 0;
                $paymentStatus = $validated['payment_status'];
                $shippingPaymentMethod = $validated['shipping_payment_method'] ?? null;
                $transferAccountId = $validated['transfer_to_account_id'] ?? null;
                $deliveryAddressId = $validated['delivery_address_id'] ?? null;
                $imagePaymentPath = null;

                // Conditional Logic Refactor
                if ($validated['payment_method'] === 'manual_transfer') {
                    if ($isSelfPickup) {
                        $deliveryAddressId = null;
                        $shippingCost = 0;
                        if (empty($transferAccountId)) {
                            return back()->withErrors(['transfer_to_account_id' => 'Rekening tujuan transfer wajib dipilih untuk metode ambil sendiri.']);
                        }
                        if ($paymentStatus == 1 && !$request->hasFile('image_payment')) {
                            return back()->withErrors(['image_payment' => 'Bukti transfer wajib diupload untuk status pembayaran ini.']);
                        }
                    } else { // Delivery
                        if (empty($deliveryAddressId)) {
                            return back()->withErrors(['delivery_address_id' => 'Alamat pengiriman wajib dipilih.']);
                        }
                        if ($paymentStatus == 1 && $shippingPaymentMethod === 'via_us' && $shippingCost > 0) {
                            if (empty($transferAccountId)) {
                                return back()->withErrors(['transfer_to_account_id' => 'Rekening tujuan transfer wajib dipilih.']);
                            }
                            if (!$request->hasFile('image_payment')) {
                                return back()->withErrors(['image_payment' => 'Bukti transfer wajib diupload.']);
                            }
                        }
                    }
                } else { // Midtrans
                    if ($isSelfPickup) {
                        $deliveryAddressId = null;
                        $shippingCost = 0;
                    } else {
                        if (empty($deliveryAddressId)) {
                            return back()->withErrors(['delivery_address_id' => 'Alamat pengiriman wajib dipilih.']);
                        }
                    }
                    $paymentStatus = 4; // 'Belum dibayar' for Midtrans initially
                }

                if ($request->hasFile('image_payment')) {
                    $imagePaymentPath = $request->file('image_payment')->store('payments', 'public');
                    Log::info('Image payment stored at: ' . $imagePaymentPath);
                }

                // Calculate total price and prepare items with correct prices from backend
                $processedItems = [];
                $subtotal = 0;

                foreach ($validated['items'] as $itemData) {
                    $product = Product::findOrFail($itemData['product_id']);
                    $price = $product->getPriceByQuantity($itemData['quantity']);
                    $itemSubtotal = $price * $itemData['quantity'];
                    
                    $processedItems[] = [
                        'product_id' => $product->id,
                        'quantity' => $itemData['quantity'],
                        'price' => $price,
                        'subtotal' => $itemSubtotal,
                    ];
                    
                    $subtotal += $itemSubtotal;
                }

                $totalPrice = $subtotal + $shippingCost;
                $paymentMethod = $validated['payment_method'] ?? 'manual_transfer';
                
                // Calculate dynamic admin fee
                $adminFee = 0;
                if ($paymentMethod !== 'manual_transfer') {
                    $midtransFees = config('services.midtrans.fees');
                    if (isset($midtransFees[$paymentMethod])) {
                        $method = $midtransFees[$paymentMethod];
                        if ($method['type'] === 'fixed') {
                            $adminFee = $method['value'];
                        } elseif ($method['type'] === 'percentage') {
                            $adminFee = round($totalPrice * $method['value']);
                        } elseif ($method['type'] === 'mix') {
                            $adminFee = round($totalPrice * $method['percent']) + $method['fixed'];
                        }
                    }
                }

                $grandTotal = $totalPrice + $adminFee;

                $orderData = [
                    'for'                   => '1', // Customer order via apps/order
                    'ordered_by_id'         => $this->cartUserId($request),
                    'delivery_service_id'   => $validated['delivery_service_id'],
                    'delivery_address_id'   => $deliveryAddressId,
                    'transfer_to_account_id'=> $transferAccountId,
                    'delivery_date'         => $validated['delivery_date'],
                    'total_price'           => $grandTotal,
                    'shipping_cost'         => $shippingCost,
                    'admin_fee'             => $adminFee,
                    'payment_status'        => $paymentStatus,
                    'payment_method'        => $paymentMethod,
                    'delivery_status'       => '1',
                    'image_payment'         => $imagePaymentPath,
                    'notes'                 => $request->notes,
                ];

                if (Schema::hasColumn('sales_orders', 'shipping_payment_method')) {
                    $orderData['shipping_payment_method'] = $shippingPaymentMethod;
                }

                Log::info('Data for SalesOrder creation:', $orderData);

                $order = SalesOrder::create($orderData);
                Log::info('SalesOrder created successfully with ID: ' . $order->id);


                foreach ($processedItems as $item) {
                    DetailSalesOrder::create([
                        'sales_order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['price'],
                        'subtotal_price' => $item['subtotal'],
                    ]);
                }
                Log::info('DetailSalesOrder created successfully for order ID: ' . $order->id);

                Cart::where('user_id', $this->cartUserId($request))->delete();
                Log::info('Cart cleared for user ID: ' . $request->user()->id);

                $order->load(['deliveryService', 'deliveryAddress', 'transferToAccount.bank', 'detailSalesOrders.product', 'orderedBy']);

                if ($paymentMethod !== 'manual_transfer') {
                    $midtransService = new \App\Services\MidtransService();
                    // Pass the orderedBy relation as user for customer_details
                    $order->user = $request->user();
                    $snapToken = $midtransService->getSnapToken($order);
                    
                    return response()->json([
                        'message' => 'Pesanan berhasil dibuat!',
                        'snap_token' => $snapToken,
                        'order_id' => $order->id,
                    ]);
                }

                return redirect()->route('checkout.success', ['order' => $order->id]);
            });
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Checkout Validation Error:', [
                'errors' => $e->errors(),
                'request_data' => $request->all(),
            ]);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Checkout Process Error (Top Level):', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all(),
            ]);
            if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                return response()->json(['message' => 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'], 500);
            }

            return back()
                ->withErrors(['checkout' => 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'])
                ->withInput();
        }
    }
    public function midtransCallback(Request $request)
    {
        Log::info('Midtrans Callback Received:', $request->all());

        $serverKey = config('services.midtrans.server_key');
        $hashed = hash("sha512", $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        if ($hashed !== $request->signature_key) {
            Log::error('Midtrans Callback: Invalid Signature');
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // Midtrans order_id is usually "ORDERID-TIMESTAMP"
        $orderId = explode('-', $request->order_id)[0];
        $order = SalesOrder::find($orderId);

        if (!$order) {
            Log::error('Midtrans Callback: Order Not Found - ' . $orderId);
            return response()->json(['message' => 'Order not found'], 404);
        }

        $transactionStatus = $request->transaction_status;
        $type = $request->payment_type;
        $fraud = $request->fraud_status;

        // Update transaction ID if available
        if ($request->transaction_id) {
            $order->midtrans_transaction_id = $request->transaction_id;
        }

        if ($transactionStatus == 'capture') {
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    $order->payment_status = 4; // Menunggu Pembayaran (Challenge)
                } else {
                    $order->payment_status = 2; // Valid / Sudah Dibayar
                }
            }
        } else if ($transactionStatus == 'settlement') {
            $order->payment_status = 2; // Valid / Sudah Dibayar
        } else if ($transactionStatus == 'pending') {
            $order->payment_status = 4; // Menunggu Pembayaran
        } else if ($transactionStatus == 'deny' || $transactionStatus == 'expire' || $transactionStatus == 'cancel') {
            $order->payment_status = 3; // Gagal / Batal
        }

        $order->save();

        Log::info('Midtrans Callback: Order ' . $orderId . ' updated to status ' . $order->payment_status);

        return response()->json(['message' => 'Success']);
    }
}
