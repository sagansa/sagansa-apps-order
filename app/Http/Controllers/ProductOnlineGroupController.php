<?php

namespace App\Http\Controllers;

use App\Models\DetailSalesOrder;
use App\Models\ProductOnlineGroup;
use App\Models\ProductView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductOnlineGroupController extends Controller
{
    public function show(Request $request, $slug)
    {
        $group = ProductOnlineGroup::with(['unit', 'onlineCategory', 'items.product', 'priceTiers', 'images.image'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Jumlah terjual = SUM(quantity) dari order dengan delivery_status=3 (sudah dikirim).
        // Hitung dari baris detail yang menunjuk langsung ke group (product_online_group_id),
        // atau ke salah satu produk anggota group (mencakup baris lama sebelum backfill).
        $memberProductIds = $group->items()->pluck('product_id');

        $soldCount = DetailSalesOrder::where(function ($q) use ($group, $memberProductIds) {
            $q->where('product_online_group_id', $group->id);
            if ($memberProductIds->isNotEmpty()) {
                $q->orWhereIn('product_id', $memberProductIds);
            }
        })
            ->whereHas('salesOrder', fn($q) => $q->where('delivery_status', 3))
            ->sum('quantity');

        return Inertia::render('ProductGroupDetail', [
            'group' => $group,
            'soldCount' => (int) $soldCount,
        ]);
    }
}
