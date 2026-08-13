<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\DeliveryService;
use App\Models\DeliveryAddress;
use App\Models\TransferToAccount;
use App\Services\MidtransService;
use App\Services\ImgServiceUploader;
use App\Models\SalesOrder;
use App\Models\DetailSalesOrder;
use App\Models\Product;
use App\Models\ProductOnlineGroup;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class CartController extends Controller
{
    public function __construct(
        private MidtransService $midtransService,
        private ImgServiceUploader $imgUploader
    ) {}

    public function getCardToken(Request $request)
    {
        $request->validate([
            'card_number' => 'required|string',
            'card_exp_month' => 'required|string',
            'card_exp_year' => 'required|string',
            'card_cvv' => 'required|string',
        ]);

        try {
            $client = new \GuzzleHttp\Client();
            $apiUrl = config('services.midtrans.is_production')
                ? 'https://api.midtrans.com/v2/token'
                : 'https://api.sandbox.midtrans.com/v2/token';

            $body = [
                'card_number' => $request->card_number,
                'card_exp_month' => $request->card_exp_month,
                'card_exp_year' => $request->card_exp_year,
                'card_cvv' => $request->card_cvv,
            ];

            $response = $client->post($apiUrl, [
                'headers' => [
                    'Authorization' => 'Basic ' . base64_encode(config('services.midtrans.server_key') . ':'),
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ],
                'json' => $body,
            ]);

            $data = json_decode($response->getBody(), true);

            Log::info('Card token response:', $data ?? ['error' => 'empty']);

            return response()->json($data);
        } catch (\Exception $e) {
            Log::error('Card tokenization failed:', ['error' => $e->getMessage()]);
            return response()->json([
                'status_code' => '500',
                'status_message' => 'Gagal mendapatkan token kartu: ' . $e->getMessage(),
            ], 500);
        }
    }
    private function cartUserId(Request $request): int
    {
        return $request->user()->id;
    }

    public function index(Request $request)
    {
        $cartUserId = $this->cartUserId($request);

        $cartItems = Cart::with(['product.priceTiers', 'product.unit', 'productOnlineGroup.priceTiers', 'productOnlineGroup.unit'])
            ->where('user_id', $cartUserId)
            ->get()
            ->map(function ($cartItem) {
                $cartItem->current_stock = $this->resolveCurrentStock($cartItem);
                return $cartItem;
            });

        $deliveryServices = DeliveryService::all();
        $deliveryAddresses = DeliveryAddress::with(['province', 'city', 'district', 'subdistrict', 'postalCode'])
            ->where('user_id', $cartUserId)
            ->get();
            
        // Add information about whether address has been used in orders
        $usedAddressIds = SalesOrder::where('ordered_by_id', $cartUserId)
            ->whereNotNull('delivery_address_id')
            ->distinct()
            ->pluck('delivery_address_id')
            ->toArray();

        $deliveryAddresses->each(function ($address) use ($usedAddressIds) {
            $address->is_used_in_orders = in_array($address->id, $usedAddressIds);
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

    private function resolveCurrentStock($cartItem): ?int
    {
        if ($cartItem->product) {
            return $cartItem->product->current_stock;
        }
        if ($cartItem->productOnlineGroup) {
            return $cartItem->productOnlineGroup->current_stock;
        }
        return 0;
    }

    public function update(Request $request, Cart $cart)
    {
        if ($cart->user_id != $this->cartUserId($request)) {
            abort(403);
        }

        $request->validate(['quantity' => 'required|integer|min:1']);

        $currentStock = $this->resolveCurrentStock($cart);
        if ($currentStock !== null && $request->quantity > $currentStock) {
            return back()->withErrors(['quantity' => 'Kuantitas melebihi stok tersedia (' . $currentStock . ').']);
        }

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
            'product_id' => 'required_without:product_online_group_id|exists:products,id',
            'product_online_group_id' => 'required_without:product_id|exists:product_online_groups,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $stock = null;
        $label = 'Produk';

        if ($request->product_id) {
            $item = Product::available()->find($request->product_id);
            if (!$item) {
                return back()->withErrors(['product_id' => 'Produk sedang tidak tersedia karena stok habis.']);
            }
            $stock = $item->current_stock;
            $label = $item->name;

            $existingCart = Cart::where('user_id', $cartUserId)
                ->where('product_id', $request->product_id)
                ->first();

            if ($existingCart) {
                $newQty = $existingCart->quantity + $request->quantity;
                if ($stock !== null && $newQty > $stock) {
                    return back()->withErrors(['quantity' => 'Kuantitas melebihi stok tersedia (' . $stock . ').']);
                }
                $existingCart->increment('quantity', $request->quantity);
            } else {
                if ($stock !== null && $request->quantity > $stock) {
                    return back()->withErrors(['quantity' => 'Kuantitas melebihi stok tersedia (' . $stock . ').']);
                }
                Cart::create([
                    'user_id' => $cartUserId,
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity
                ]);
            }
        } else {
            $item = ProductOnlineGroup::where('is_active', true)->find($request->product_online_group_id);
            if (!$item) {
                return back()->withErrors(['product_online_group_id' => 'Grup produk tidak aktif.']);
            }
            $stock = $item->current_stock;
            $label = $item->name;

            if ($stock !== null && $request->quantity > $stock) {
                return back()->withErrors(['quantity' => 'Kuantitas melebihi stok tersedia (' . $stock . ').']);
            }

            $existingCart = Cart::where('user_id', $cartUserId)
                ->where('product_online_group_id', $request->product_online_group_id)
                ->first();

            if ($existingCart) {
                $newQty = $existingCart->quantity + $request->quantity;
                if ($stock !== null && $newQty > $stock) {
                    return back()->withErrors(['quantity' => 'Kuantitas melebihi stok tersedia (' . $stock . ').']);
                }
                $existingCart->increment('quantity', $request->quantity);
            } else {
                Cart::create([
                    'user_id' => $cartUserId,
                    'product_online_group_id' => $request->product_online_group_id,
                    'quantity' => $request->quantity
                ]);
            }
        }

        return back()->with('success', $label . ' berhasil ditambahkan ke keranjang!');
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
                    'image_payment' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:2048',
                    'shipping_cost' => 'nullable|numeric|min:0',
                    'notes' => 'nullable|string|max:500',
                    'payment_status' => 'required|integer|in:1,4,5',
                    'payment_method' => 'required|string|in:manual_transfer,bca_va,mandiri_va,bni_va,bri_va,permata_va,other_va,qris,credit_card',
                    'card_token' => 'nullable|string|required_if:payment_method,credit_card',
                    'shipping_payment_method' => 'nullable|string|in:via_us,to_courier',
                    'items' => 'required|array|min:1',
                    'items.*.product_id' => 'nullable|exists:products,id',
                    'items.*.product_online_group_id' => 'nullable|exists:product_online_groups,id',
                    'items.*.quantity' => 'required|integer|min:1',
                    'items.*.price' => 'required|numeric|min:0',
                ]);

                Log::info('Validation successful.', $validated);

                $isSelfPickup = $validated['delivery_service_id'] == 33;
                $shippingCost = $validated['shipping_cost'] ?? 0;
                $paymentStatus = $validated['payment_status'];
                $shippingPaymentMethod = $validated['shipping_payment_method'] ?? null;
                $transferAccountId = $validated['transfer_to_account_id'] ?? null;
                $deliveryAddressId = $validated['delivery_address_id'] ?? null;
                $imagePaymentPath = null;

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
                    } else {
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
                } else {
                    if ($isSelfPickup) {
                        $deliveryAddressId = null;
                        $shippingCost = 0;
                    } else {
                        if (empty($deliveryAddressId)) {
                            return back()->withErrors(['delivery_address_id' => 'Alamat pengiriman wajib dipilih.']);
                        }
                    }
                    $paymentStatus = 4;
                }

                if ($request->hasFile('image_payment')) {
                    $imagePaymentPath = $this->imgUploader->upload(
                        $request->file('image_payment'),
                        'images/SalesOrder'
                    );
                    if (! $imagePaymentPath) {
                        return back()->withErrors(['image_payment' => 'Gagal upload bukti pembayaran ke image service. Silakan coba lagi.']);
                    }
                }

                // Validate stock availability & calculate prices
                $outOfStockItems = [];
                $processedItems = [];
                $subtotal = 0;

                foreach ($validated['items'] as $itemData) {
                    $itemData['product_id'] = $itemData['product_id'] ?? null;
                    $itemData['product_online_group_id'] = $itemData['product_online_group_id'] ?? null;

                    if ($itemData['product_id']) {
                        $product = Product::available()->find($itemData['product_id']);
                        if (!$product) {
                            $product = Product::find($itemData['product_id']);
                            $outOfStockItems[] = $product ? $product->name : 'ID#' . $itemData['product_id'];
                            continue;
                        }

                        $stock = $product->current_stock;
                        if ($stock !== null && $itemData['quantity'] > $stock) {
                            return back()->withErrors(['items' => $product->name . ': kuantitas melebihi stok tersedia (' . $stock . ').']);
                        }

                        $price = $product->getPriceByQuantity($itemData['quantity']);
                        $itemSubtotal = $price * $itemData['quantity'];

                        $processedItems[] = [
                            'product_id' => $product->id,
                            'product_online_group_id' => null,
                            'quantity' => $itemData['quantity'],
                            'price' => $price,
                            'subtotal' => $itemSubtotal,
                        ];
                    } elseif ($itemData['product_online_group_id']) {
                        $group = ProductOnlineGroup::where('is_active', true)->find($itemData['product_online_group_id']);
                        if (!$group) {
                            $outOfStockItems[] = 'Grup #' . $itemData['product_online_group_id'];
                            continue;
                        }

                        $stock = $group->current_stock;
                        if ($stock !== null && $itemData['quantity'] > $stock) {
                            return back()->withErrors(['items' => $group->name . ': kuantitas melebihi stok tersedia (' . $stock . ').']);
                        }

                        $price = $group->getPriceByQuantity($itemData['quantity']);
                        $itemSubtotal = $price * $itemData['quantity'];

                        $processedItems[] = [
                            'product_id' => null,
                            'product_online_group_id' => $group->id,
                            'quantity' => $itemData['quantity'],
                            'price' => $price,
                            'subtotal' => $itemSubtotal,
                        ];
                    }

                    $subtotal += $itemSubtotal ?? 0;
                }

                if ($outOfStockItems) {
                    $names = implode(', ', $outOfStockItems);
                    Log::warning('Checkout failed: items out of stock', ['items' => $outOfStockItems]);
                    return back()->withErrors(['items' => 'Item berikut sedang tidak tersedia karena stok habis: ' . $names . '. Silakan hapus dari keranjang.']);
                }

                $totalPrice = $subtotal + $shippingCost;
                $paymentMethod = $validated['payment_method'] ?? 'manual_transfer';
                
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
                    'for'                   => '1',
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
                        'product_online_group_id' => $item['product_online_group_id'],
                        'quantity' => $item['quantity'],
                        'unit_price' => $item['price'],
                        'subtotal_price' => $item['subtotal'],
                    ]);
                }
                Log::info('DetailSalesOrder created successfully for order ID: ' . $order->id);

                Cart::where('user_id', $this->cartUserId($request))->delete();
                Log::info('Cart cleared for user ID: ' . $request->user()->id);

                $order->load(['deliveryService', 'deliveryAddress', 'transferToAccount.bank', 'detailSalesOrders.product', 'detailSalesOrders.productOnlineGroup', 'orderedBy']);

                if ($paymentMethod !== 'manual_transfer') {
                    $paymentResult = $this->midtransService->chargeCoreApi($order, $paymentMethod, $validated['card_token'] ?? null);
                    
                    $order->midtrans_response = json_encode($paymentResult);
                    $order->midtrans_transaction_id = $paymentResult->transaction_id ?? null;
                    $order->midtrans_payment_type = $paymentResult->payment_type ?? null;
                    $order->midtrans_status = $paymentResult->transaction_status ?? null;
                    $order->save();
                    
                    return response()->json([
                        'message' => 'Pesanan berhasil dibuat!',
                        'payment' => $paymentResult,
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
}
