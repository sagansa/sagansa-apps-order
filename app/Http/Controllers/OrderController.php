<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductOnlineGroup;
use App\Models\ProductOnlineGroupItem;
use App\Models\OnlineCategory;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SalesOrder;
use App\Models\DetailSalesOrder;
use App\Models\TransferToAccount;
use App\Services\MidtransService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function __construct(
        protected MidtransService $midtransService
    ) {}

    private function userId(Request $request): int
    {
        return $request->user()->id;
    }

    public function index(Request $request)
    {
        Log::info('OrderController@index request:', $request->all());

        $user = $request->user();

        // Ambil riwayat pembelian pribadi user (jika login) untuk sorting
        $personalOrderCounts = collect();
        $personalGroupOrderCounts = collect();
        if ($user) {
            $personalOrderCounts = DetailSalesOrder::select('product_id', DB::raw('SUM(quantity) as total_qty'))
                ->whereHas('salesOrder', function ($q) use ($user) {
                    $q->where('ordered_by_id', $user->id);
                })
                ->groupBy('product_id')
                ->pluck('total_qty', 'product_id');

            $personalGroupOrderCounts = DetailSalesOrder::select('product_online_group_id', DB::raw('SUM(quantity) as total_qty'))
                ->whereNotNull('product_online_group_id')
                ->whereHas('salesOrder', function ($q) use ($user) {
                    $q->where('ordered_by_id', $user->id);
                })
                ->groupBy('product_online_group_id')
                ->pluck('total_qty', 'product_online_group_id');
        }

        // Produk fisik yang menjadi anggota grup tidak ditampilkan sendiri
        $memberProductIds = ProductOnlineGroupItem::pluck('product_id');

        // Query produk fisik (non-anggota grup)
        $physicalProducts = Product::with(['unit', 'onlineCategory', 'priceTiers'])
            ->withCount('detailSalesOrders')
            ->whereHas('onlineCategory', function ($q) {
                $q->where('id', '!=', 4);
            })
            ->where(function ($query) {
                $query->where('online_price', '>', 0)
                      ->orWhereHas('priceTiers');
            })
            ->when($memberProductIds->isNotEmpty(), function ($query) use ($memberProductIds) {
                $query->whereNotIn('id', $memberProductIds);
            })
            ->when(request('category') && request('category') !== 'all', function ($query) {
                $query->whereHas('onlineCategory', function ($q) {
                    $q->where('id', request('category'));
                });
            })
            ->when(request('min_price'), function ($query) {
                $query->where('online_price', '>=', request('min_price'));
            })
            ->when(request('max_price'), function ($query) {
                $query->where('online_price', '<=', request('max_price'));
            })
            ->when(request('unit') && request('unit') !== 'all', function ($query) {
                $query->whereHas('unit', function ($q) {
                    $q->where('id', request('unit'));
                });
            })
            ->when(request('search'), function ($query) {
                $query->where('name', 'like', '%' . request('search') . '%');
            })
            ->get()
            ->map(function ($product) {
                return (object) [
                    'display_type' => 'product',
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'image_url' => $product->image_url,
                    'current_stock' => $product->current_stock,
                    'online_price' => $product->online_price,
                    'price_tiers' => $product->priceTiers,
                    'unit' => $product->unit,
                    'online_category_id' => $product->online_category_id,
                    'online_category' => $product->onlineCategory,
                    'detail_sales_orders_count' => $product->detail_sales_orders_count,
                ];
            });

        // Hitung global order count per produk (untuk sorting popularitas grup)
        $globalProductCounts = DB::table('detail_sales_orders')
            ->select('product_id', DB::raw('COUNT(*) as count'))
            ->groupBy('product_id')
            ->pluck('count', 'product_id');

        // Query grup aktif
        $groups = ProductOnlineGroup::with(['unit', 'onlineCategory', 'priceTiers', 'items', 'images.image'])
            ->where('is_active', true)
            ->whereHas('onlineCategory', function ($q) {
                $q->where('id', '!=', 4);
            })
            ->where(function ($query) {
                $query->where('online_price', '>', 0)
                      ->orWhereHas('priceTiers');
            })
            ->when(request('category') && request('category') !== 'all', function ($query) {
                $query->whereHas('onlineCategory', function ($q) {
                    $q->where('id', request('category'));
                });
            })
            ->when(request('min_price'), function ($query) {
                $query->where('online_price', '>=', request('min_price'));
            })
            ->when(request('max_price'), function ($query) {
                $query->where('online_price', '<=', request('max_price'));
            })
            ->when(request('unit') && request('unit') !== 'all', function ($query) {
                $query->whereHas('unit', function ($q) {
                    $q->where('id', request('unit'));
                });
            })
            ->when(request('search'), function ($query) {
                $query->where('name', 'like', '%' . request('search') . '%');
            })
            ->get()
            ->map(function ($group) use ($globalProductCounts) {
                $memberIds = $group->items->pluck('product_id');
                $groupPopularity = $memberIds->reduce(function ($carry, $pid) use ($globalProductCounts) {
                    return $carry + (int) ($globalProductCounts[$pid] ?? 0);
                }, 0);

                return (object) [
                    'display_type' => 'group',
                    'id' => $group->id,
                    'name' => $group->name,
                    'slug' => $group->slug,
                    'image_url' => $group->image_url,
                    'current_stock' => $group->current_stock,
                    'online_price' => $group->online_price,
                    'price_tiers' => $group->priceTiers,
                    'unit' => $group->unit,
                    'online_category_id' => $group->online_category_id,
                    'online_category' => $group->onlineCategory,
                    'detail_sales_orders_count' => $groupPopularity,
                ];
            });

        // Mapping: product_id => group_id untuk menghitung personal count grup dari order lama
        $productToGroupMap = ProductOnlineGroupItem::pluck('product_online_group_id', 'product_id');

        // Gabung & sort
        $products = $physicalProducts->concat($groups)
            ->sortByDesc(function ($item) use ($personalOrderCounts, $personalGroupOrderCounts, $productToGroupMap) {
                if ($item->display_type === 'group') {
                    $personalCount = (int) ($personalGroupOrderCounts[$item->id] ?? 0);
                    // Tambahkan order personal dari produk anggota (transaksi sebelum grouping)
                    foreach ($productToGroupMap as $pid => $gid) {
                        if ((int) $gid === $item->id) {
                            $personalCount += (int) ($personalOrderCounts[$pid] ?? 0);
                        }
                    }
                } else {
                    $personalCount = (int) ($personalOrderCounts[$item->id] ?? 0);
                }
                $globalCount = (int) ($item->detail_sales_orders_count ?? 0);
                return sprintf('%010d-%010d', $personalCount, $globalCount);
            })
            ->values();

        // Produk yang pernah diorder user (untuk quick reorder)
        $lastOrderedProducts = collect();
        if ($user) {
            // Group yang sudah pernah diorder langsung (transaksi baru)
            $orderedGroupIds = DetailSalesOrder::whereNotNull('product_online_group_id')
                ->whereHas('salesOrder', function ($q) use ($user) {
                    $q->where('ordered_by_id', $user->id);
                })
                ->select('product_online_group_id')
                ->distinct()
                ->pluck('product_online_group_id');

            // Produk fisik yang pernah diorder
            $orderedProductIds = DetailSalesOrder::whereHas('salesOrder', function ($q) use ($user) {
                $q->where('ordered_by_id', $user->id);
            })
                ->select('product_id')
                ->distinct()
                ->pluck('product_id');

            // Personal order counts per produk (untuk sorting)
            $personalProductCounts = DetailSalesOrder::select('product_id', DB::raw('SUM(quantity) as total_qty'))
                ->whereHas('salesOrder', function ($q) use ($user) {
                    $q->where('ordered_by_id', $user->id);
                })
                ->whereIn('product_id', $orderedProductIds)
                ->groupBy('product_id')
                ->pluck('total_qty', 'product_id');

            $personalGroupCounts = DetailSalesOrder::select('product_online_group_id', DB::raw('SUM(quantity) as total_qty'))
                ->whereNotNull('product_online_group_id')
                ->whereHas('salesOrder', function ($q) use ($user) {
                    $q->where('ordered_by_id', $user->id);
                })
                ->groupBy('product_online_group_id')
                ->pluck('total_qty', 'product_online_group_id');

            // Mapping: product_id => group yang dimilikinya
            $productToGroup = ProductOnlineGroupItem::with('group')
                ->whereIn('product_id', $orderedProductIds)
                ->get()
                ->filter(fn($item) => $item->group && $item->group->is_active)
                ->keyBy('product_id');

            $seenGroupIds = collect();

            // Produk non-anggota grup → tampilkan langsung
            $nonMemberIds = $orderedProductIds->filter(fn($pid) => !$productToGroup->has($pid));
            $lastOrderedFromProducts = collect();
            if ($nonMemberIds->isNotEmpty()) {
                $lastOrderedFromProducts = Product::with(['unit', 'onlineCategory', 'priceTiers'])
                    ->whereIn('id', $nonMemberIds)
                    ->whereHas('onlineCategory', function ($q) {
                        $q->where('id', '!=', 4);
                    })
                    ->where(function ($query) {
                        $query->where('online_price', '>', 0)
                              ->orWhereHas('priceTiers');
                    })
                    ->get()
                    ->map(function ($product) {
                        return (object) [
                            'display_type' => 'product',
                            'id' => $product->id,
                            'name' => $product->name,
                            'slug' => $product->slug,
                            'image_url' => $product->image_url,
                            'current_stock' => $product->current_stock,
                            'online_price' => $product->online_price,
                            'price_tiers' => $product->priceTiers,
                            'unit' => $product->unit,
                            'online_category_id' => $product->online_category_id,
                            'online_category' => $product->onlineCategory,
                        ];
                    });
            }

            // Produk anggota grup → ganti dengan grup-nya (deduplikasi)
            $resolvedGroupIds = collect();
            foreach ($orderedProductIds as $pid) {
                if ($productToGroup->has($pid)) {
                    $gid = $productToGroup[$pid]->product_online_group_id;
                    $resolvedGroupIds->push($gid);
                }
            }
            $resolvedGroupIds = $resolvedGroupIds->merge($orderedGroupIds)->unique();

            $lastOrderedFromGroups = collect();
            if ($resolvedGroupIds->isNotEmpty()) {
                $lastOrderedFromGroups = ProductOnlineGroup::with(['unit', 'onlineCategory', 'priceTiers'])
                    ->whereIn('id', $resolvedGroupIds)
                    ->where('is_active', true)
                    ->get()
                    ->map(function ($group) {
                        return (object) [
                            'display_type' => 'group',
                            'id' => $group->id,
                            'name' => $group->name,
                            'slug' => $group->slug,
                            'image_url' => $group->image_url,
                            'current_stock' => $group->current_stock,
                            'online_price' => $group->online_price,
                            'price_tiers' => $group->priceTiers,
                            'unit' => $group->unit,
                            'online_category_id' => $group->online_category_id,
                            'online_category' => $group->onlineCategory,
                        ];
                    });
            }

            // Gabung, sort, take(10)
            $lastOrderedProducts = $lastOrderedFromProducts->concat($lastOrderedFromGroups)
                ->sortByDesc(function ($item) use ($personalProductCounts, $personalGroupCounts, $productToGroup) {
                    if ($item->display_type === 'group') {
                        $count = (int) ($personalGroupCounts[$item->id] ?? 0);
                        // Tambahkan order count dari produk anggota yang diorder sebelum grouping
                        foreach ($productToGroup as $pid => $pivot) {
                            if ($pivot->product_online_group_id === $item->id) {
                                $count += (int) ($personalProductCounts[$pid] ?? 0);
                            }
                        }
                        return $count;
                    }
                    return (int) ($personalProductCounts[$item->id] ?? 0);
                })
                ->take(10)
                ->values();
        }

        $categories = OnlineCategory::all();
        $units = Unit::all();

        return Inertia::render('Order', [
            'products' => $products,
            'categories' => $categories,
            'units' => $units,
            'lastOrderedProducts' => $lastOrderedProducts,
        ]);
    }

    protected $deliveryStatusMapping = [
        1 => 'Belum dikirim',
        2 => 'Diproses',
        3 => 'Sudah dikirim',
        4 => 'Siap dikirim',
        5 => 'Perbaiki',
        6 => 'Dikembalikan',
    ];

    protected $paymentStatusMapping = [
        1 => 'Dibayar',
        2 => 'Valid',
        3 => 'Tidak valid',
        4 => 'Belum dibayar',
        5 => 'Pending',
    ];

    public function orderHistory(Request $request)
    {
        $order = SalesOrder::with(['detailSalesOrders.product'])
            ->where('ordered_by_id', $this->userId($request))
            ->orderByDesc('created_at')
            ->paginate(10)
            ->through(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'date' => $order->delivery_date ? $order->delivery_date->format('d F Y') : ($order->created_at ? $order->created_at->format('d F Y') : '-'),
                    'delivery_status_label' => $this->deliveryStatusMapping[$order->delivery_status] ?? 'Tidak Diketahui',
                    'delivery_status_value' => $order->delivery_status,
                    'payment_status_label' => $this->paymentStatusMapping[$order->payment_status] ?? 'Tidak Diketahui',
                    'payment_status_value' => $order->payment_status,
                    'total' => $order->total_price,
                ];
            });

        return Inertia::render('TransactionHistory', [
            'orders' => $order,
        ]);
    }

    public function show(Request $request, $id)
    {
        $order = SalesOrder::with([
            'detailSalesOrders.product',
            'detailSalesOrders.productOnlineGroup',
            'transferToAccount.bank',
            'deliveryAddress.province',
            'deliveryAddress.city',
            'deliveryAddress.district',
            'deliveryAddress.subdistrict',
            'deliveryAddress.postalCode',
        ])
            ->where('id', $id)
            ->where('ordered_by_id', $this->userId($request))
            ->firstOrFail();

        $midtransPayment = $order->midtrans_response ? json_decode($order->midtrans_response, true) : null;

        $data = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'date' => $order->delivery_date ? $order->delivery_date->format('d F Y') : ($order->created_at ? $order->created_at->format('d F Y') : '-'),
            'status' => $this->deliveryStatusMapping[$order->delivery_status] ?? 'Tidak Diketahui',
            'total' => $order->total_price,
            'admin_fee' => $order->admin_fee,
            'delivery_service_id' => $order->delivery_service_id,
            'payment_method' => $order->payment_method,
            'midtrans_payment' => $midtransPayment,
            'delivery_address' => $order->deliveryAddress ? [
                'name' => $order->deliveryAddress->recipient_name,
                'phone' => $order->deliveryAddress->recipient_telp_no,
                'address' => $order->deliveryAddress->address,
                'province' => $order->deliveryAddress->province,
                'city' => $order->deliveryAddress->city,
                'district' => $order->deliveryAddress->district,
                'subdistrict' => $order->deliveryAddress->subdistrict,
                'postal_code' => $order->deliveryAddress->postalCode,
            ] : null,
            'transfer_to_account' => $order->transferToAccount ? [
                'bank' => $order->transferToAccount->bank->name ?? 'Tidak Diketahui Bank',
                'account_number' => $order->transferToAccount->number ?? '-',
                'account_name' => $order->transferToAccount->name ?? '-',
            ] : null,
            'image_payment' => $order->image_payment,
            'payment_status_value' => $order->payment_status,
            'payment_status_label' => $this->paymentStatusMapping[$order->payment_status] ?? 'Tidak Diketahui',
            'delivery_status_value' => $order->delivery_status,
            'delivery_status_label' => $this->deliveryStatusMapping[$order->delivery_status] ?? 'Tidak Diketahui',
            'shipping_cost' => $order->shipping_cost,
            'receipt_no' => $order->receipt_no,
            'image_delivery' => $order->image_delivery,
            'received_by' => $order->received_by,
            'details' => $order->detailSalesOrders->map(function ($detail) {
                $productName = 'Produk Tidak Diketahui';
                $unitName = '';
                if ($detail->product) {
                    $productName = $detail->product->name;
                    $unitName = $detail->product->unit->unit ?? '';
                } elseif ($detail->productOnlineGroup) {
                    $productName = $detail->productOnlineGroup->name;
                    $unitName = $detail->productOnlineGroup->unit->unit ?? '';
                }
                return [
                    'product_name' => $productName,
                    'quantity' => $detail->quantity,
                    'unit' => $unitName,
                    'unit_price' => $detail->unit_price,
                    'subtotal_price' => $detail->subtotal_price,
                ];
            }),
        ];

        // Ambil daftar rekening tujuan transfer
        $transferToAccounts = TransferToAccount::with('bank')->get();

        return Inertia::render('TransactionDetail', [
            'order' => $data,
            'transferToAccounts' => $transferToAccounts,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function regeneratePayment($id)
    {
        $order = SalesOrder::with(['orderedBy', 'detailSalesOrders.product', 'detailSalesOrders.productOnlineGroup', 'deliveryService', 'deliveryAddress', 'transferToAccount.bank'])
            ->where('ordered_by_id', auth()->id())
            ->findOrFail($id);

        if ($order->payment_status === 1) {
            return back()->withErrors(['payment' => 'Pesanan ini sudah dibayar.']);
        }

        if ($order->payment_method === 'manual_transfer') {
            return back()->withErrors(['payment' => 'Pembayaran manual tidak bisa di-generate ulang.']);
        }

        try {
            $paymentResult = $this->midtransService->chargeCoreApi($order, $order->payment_method);

            $order->midtrans_response = json_encode($paymentResult);
            $order->midtrans_transaction_id = $paymentResult->transaction_id ?? null;
            $order->midtrans_payment_type = $paymentResult->payment_type ?? null;
            $order->midtrans_status = $paymentResult->transaction_status ?? null;
            $order->payment_status = 4;
            $order->save();

            return redirect()->route('checkout.success', ['order' => $order->id]);
        } catch (\Exception $e) {
            Log::error('Regenerate payment failed:', [
                'order_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return back()->withErrors(['payment' => 'Gagal: ' . $e->getMessage()]);
        }
    }

    public function updatePayment(Request $request, $id)
    {
        $order = SalesOrder::where('ordered_by_id', auth()->id())->findOrFail($id);

        $request->validate([
            'transfer_to_account_id' => 'required|exists:transfer_to_accounts,id',
            'image_payment' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:2048',
        ]);

        $updateData = [
            'transfer_to_account_id' => $request->transfer_to_account_id,
            'payment_status' => 1, // 'Dibayar'
        ];

        if ($request->hasFile('image_payment')) {
            $imagePath = $request->file('image_payment')->store('payments', 'public');
            $updateData['image_payment'] = $imagePath;
        }

        $order->update($updateData);

        Log::info('Order payment updated:', ['order_id' => $id, 'transfer_to_account_id' => $request->transfer_to_account_id]);

        return back()->with('success', 'Bukti transfer berhasil diupload!');
    }
}
