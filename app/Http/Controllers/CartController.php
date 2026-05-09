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
use Illuminate\Support\Facades\Log;

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

        return Inertia::render('Cart', [
            'cartItems' => $cartItems,
            'deliveryServices' => $deliveryServices,
            'deliveryAddresses' => $deliveryAddresses,
            'transferToAccounts' => $transferToAccounts,
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

                if ($request->hasFile('image_payment')) {
                    $imagePaymentPath = $request->file('image_payment')->store('payments', 'public');
                    Log::info('Image payment stored at: ' . $imagePaymentPath);
                }

                // Calculate total price
                $subtotal = array_reduce($validated['items'], fn ($sum, $item) => $sum + ($item['quantity'] * $item['price']), 0);
                $totalPrice = $subtotal + $shippingCost;

                $orderData = [
                    'ordered_by_id' => $this->cartUserId($request),
                    'delivery_service_id' => $validated['delivery_service_id'],
                    'delivery_address_id' => $deliveryAddressId,
                    'transfer_to_account_id' => $transferAccountId,
                    'delivery_date' => $validated['delivery_date'],
                    'total_price' => $totalPrice,
                    'shipping_cost' => $shippingCost,
                    'payment_status' => $paymentStatus,
                    'delivery_status' => '1',
                    'image_payment' => $imagePaymentPath,
                    'notes' => $request->notes,
                ];

                Log::info('Data for SalesOrder creation:', $orderData);

                $order = SalesOrder::create($orderData);
                Log::info('SalesOrder created successfully with ID: ' . $order->id);


                foreach ($validated['items'] as $item) {
                    DetailSalesOrder::create([
                        'sales_order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['price'],
                        'subtotal_price' => $item['quantity'] * $item['price'],
                    ]);
                }
                Log::info('DetailSalesOrder created successfully for order ID: ' . $order->id);

                Cart::where('user_id', $this->cartUserId($request))->delete();
                Log::info('Cart cleared for user ID: ' . $request->user()->id);

                $order->load(['deliveryService', 'deliveryAddress', 'transferToAccount.bank', 'detailSalesOrders']);

                return Inertia::render('CheckoutSuccess', [
                    'message' => 'Pesanan berhasil dibuat!',
                    'sales_order' => $order,
                ]);
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
            // Return a generic error response to the user
            return response()->json(['message' => 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'], 500);
        }
    }
}
