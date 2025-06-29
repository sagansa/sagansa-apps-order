<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\OnlineCategory;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SalesOrder;
use App\Models\DetailSalesOrder;
use App\Models\TransferToAccount;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        $products = Product::with(['unit', 'onlineCategory'])
            ->whereHas('onlineCategory', function ($q) {
                $q->where('id', '!=', 4);
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
            ->get();

        $categories = OnlineCategory::all();
        $units = Unit::all();

        return Inertia::render('Order', [
            'products' => $products,
            'categories' => $categories,
            'units' => $units
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

    ];

    public function orderHistory(Request $request)
    {
        $orders = SalesOrder::with(['detailSalesOrders.product'])
            ->where('ordered_by_id', auth()->id())
            ->orderByDesc('created_at')
            ->paginate(10)
            ->through(function ($order) {
                $combinedString = (string)$order->total_price . (string)$order->id;
                if ($order->delivery_date) {
                    $combinedString = (string)$order->delivery_date . $combinedString;
                }
                $orderNumber = substr(md5($combinedString), 0, 8);

                return [
                    'id' => $order->id,
                    'order_number' => $orderNumber,
                    'date' => $order->delivery_date ? $order->delivery_date : ($order->created_at ? $order->created_at->format('Y-m-d') : '-'),
                    'delivery_status' => $this->deliveryStatusMapping[$order->delivery_status] ?? 'Tidak Diketahui',
                    'payment_status' => $this->paymentStatusMapping[$order->payment_status] ?? 'Tidak Diketahui',
                    'total' => $order->total_price,
                ];
            });

        return Inertia::render('TransactionHistory', [
            'orders' => $orders,
        ]);
    }

    public function show($id)
    {
        $order = SalesOrder::with([
            'detailSalesOrders.product',
            'transferToAccount.bank',
            'deliveryAddress.province',
            'deliveryAddress.city',
            'deliveryAddress.district',
            'deliveryAddress.subdistrict',
            'deliveryAddress.postalCode'
        ])
            ->where('id', $id)
            ->where('ordered_by_id', auth()->id())
            ->firstOrFail();

        $combinedString = (string)$order->total_price . (string)$order->id;
        if ($order->delivery_date) {
            $combinedString = (string)$order->delivery_date . $combinedString;
        }
        $orderNumber = substr(md5($combinedString), 0, 8);

        $data = [
            'id' => $order->id,
            'order_number' => $orderNumber,
            'date' => $order->delivery_date ? $order->delivery_date : ($order->created_at ? $order->created_at->format('Y-m-d') : '-'),
            'status' => $this->deliveryStatusMapping[$order->delivery_status] ?? 'Tidak Diketahui',
            'total' => $order->total_price,
            'delivery_service_id' => $order->delivery_service_id,
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
                return [
                    'product_name' => $detail->product ? $detail->product->name : 'Produk Tidak Diketahui',
                    'quantity' => $detail->quantity,
                    'unit' => $detail->product->unit->unit,
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
        ]);
    }

    public function updatePayment(Request $request, $id)
    {
        $order = SalesOrder::findOrFail($id);

        // Validasi sederhana
        $request->validate([
            'transfer_to_account_id' => 'required|exists:transfer_to_accounts,id',
            'image_payment' => 'nullable|image|max:2048',
        ]);

        $updateData = [
            'transfer_to_account_id' => $request->transfer_to_account_id,
            'payment_status' => 1, // 'Dibayar'
        ];

        // Cek jika ada file gambar yang diupload
        if ($request->hasFile('image_payment')) {
            // Upload file
            $imagePath = $request->file('image_payment')->store('payments', 'public');
            $updateData['image_payment'] = $imagePath;
        }

        // Update field yang diperlukan
        $order->update($updateData);

        Log::info('Order payment updated:', ['order_id' => $id, 'transfer_to_account_id' => $request->transfer_to_account_id]);

        return back()->with('success', 'Bukti transfer berhasil diupload!');
    }
}
