<?php

namespace App\Http\Controllers;

use App\Models\SalesOrder;
use App\Models\DetailSalesOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        // Calculate statistics
        $totalOrders = SalesOrder::where('ordered_by_id', $userId)->count();
        $pendingOrders = SalesOrder::where('ordered_by_id', $userId)
            ->whereIn('delivery_status', [1, 2, 4]) // Belum dikirim, Diproses, Siap dikirim
            ->where('payment_status', '!=', 1) // Not 'Dibayar'
            ->count();
        $completedOrders = SalesOrder::where('ordered_by_id', $userId)
            ->where('delivery_status', 3) // Sudah dikirim
            ->count();

        // Fetch recent orders
        $recentOrders = SalesOrder::with(['detailSalesOrders.product', 'detailSalesOrders.productOnlineGroup'])
            ->where('ordered_by_id', $userId)
            ->orderByDesc('created_at')
            ->limit(5) // Limit to 5 recent orders
            ->get()
            ->map(function ($order) {
                $deliveryStatusMapping = [
                    1 => 'Belum dikirim',
                    2 => 'Diproses',
                    3 => 'Sudah dikirim',
                    4 => 'Siap dikirim',
                    5 => 'Perbaiki',
                    6 => 'Dikembalikan',
                ];

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'date' => $order->delivery_date ? $order->delivery_date->format('d F Y') : ($order->created_at ? $order->created_at->format('d F Y') : '-'),
                    'total' => 'Rp ' . number_format($order->total_price, 0, ',', '.'),
                    'status' => $deliveryStatusMapping[$order->delivery_status] ?? 'Tidak Diketahui',
                ];
            });

        // Get last order date
        $lastOrder = SalesOrder::where('ordered_by_id', $userId)->orderByDesc('created_at')->first();
        $lastOrderDate = $lastOrder ? $lastOrder->created_at->toDateString() : null;

        // Order History Data for Chart (last 6 months)
        $orderHistory = SalesOrder::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as orders')
            ->where('ordered_by_id', $userId)
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::parse($item->month)->format('M Y'), // e.g., Jan 2024
                    'orders' => $item->orders,
                ];
            });

        // Frequently Ordered Products
        $frequentlyOrderedProducts = DetailSalesOrder::selectRaw('product_id, COUNT(*) as order_count')
            ->whereHas('salesOrder', function ($query) use ($userId) {
                $query->where('ordered_by_id', $userId);
            })
            ->with(['product' => function ($query) {
                $query->select('id', 'name', 'image'); // Select only necessary product fields
            }])
            ->groupBy('product_id')
            ->orderByDesc('order_count')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->product->id ?? null,
                    'name' => $item->product->name ?? 'Produk Tidak Diketahui',
                    'order_count' => $item->order_count,
                    'image' => $item->product->image ?? null,
                ];
            });


        return Inertia::render('Dashboard', [
            'stats' => [
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'completedOrders' => $completedOrders,
            ],
            'recentOrders' => $recentOrders,
            'lastOrderDate' => $lastOrderDate,
            'orderHistoryData' => $orderHistory,
            'frequentlyOrderedProducts' => $frequentlyOrderedProducts,
        ]);
    }
}
