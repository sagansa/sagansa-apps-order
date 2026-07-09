<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductOnlineGroupItem;
use App\Models\ProductView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show(Request $request, $slug)
    {
        $product = Product::with(['unit', 'onlineCategory', 'images', 'priceTiers'])
            ->where('slug', $slug)
            ->firstOrFail();

        // Jika produk tergabung dalam grup, redirect ke halaman grup
        $groupItem = ProductOnlineGroupItem::where('product_id', $product->id)
            ->with('group')
            ->first();

        if ($groupItem && $groupItem->group && $groupItem->group->is_active) {
            return redirect()->route('product.group.show', $groupItem->group->slug);
        }

        ProductView::create([
            'product_id' => $product->id,
            'user_id' => Auth::id(),
            'session_id' => $request->session()->getId(),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return Inertia::render('ProductDetail', [
            'product' => $product
        ]);
    }
}