<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EngineeringController extends Controller
{
    public function index()
    {
        $products = Product::with(['unit', 'onlineCategory'])
            ->where('online_category_id', '=', 4)
            ->latest()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'online_price' => $product->online_price,
                    'unit' => $product->unit->unit,
                    'description' => $product->description,
                    'image' => $product->image_url ?? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                    'slug' => $product->slug,
                    'online_category_id' => $product->online_category_id
                ];
            });

        return Inertia::render('WelcomeEngineering', [
            'products' => $products
        ]);
    }
}
