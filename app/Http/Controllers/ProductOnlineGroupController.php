<?php

namespace App\Http\Controllers;

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

        return Inertia::render('ProductGroupDetail', [
            'group' => $group
        ]);
    }
}
