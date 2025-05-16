<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\OnlineCategory;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
