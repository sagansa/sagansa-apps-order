<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\OnlineCategory;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $products = Product::with(['unit', 'onlineCategory'])
            ->where('online_category_id', '!=', 4)
            ->where(function ($query) {
                $query->where('online_price', '>', 0)
                      ->orWhereHas('priceTiers');
            })
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'online_price' => $product->online_price,
                    'unit' => $product->unit->unit,
                    'description' => $product->description,
                    'image' => $product->image_url ?? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
                    'slug' => $product->slug
                ];
            });

        $categories = OnlineCategory::where('id', '!=', 4)
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description ?? '',
                    'icon' => $this->getCategoryIcon($category->id)
                ];
        });

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'products' => $products,
            'categories' => $categories
        ]);
    }

    private function getCategoryIcon($categoryId)
    {
        $icons = [
            5 => '🥩', // Daging
            6 => '🥬', // Sayuran
            7 => '🌶️', // Bumbu
            31 => '🔋', // EV
            3 => '🏭', // Bahan Baku
            1 => '🥜', // Mete
            2 => '🫒', // Minyak Wijen
        ];

        return $icons[$categoryId] ?? '📦';
    }

}