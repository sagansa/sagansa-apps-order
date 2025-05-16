<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show($slug)
    {
        $product = Product::with(['unit', 'onlineCategory', 'images'])
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('ProductDetail', [
            'product' => $product
        ]);
    }
}