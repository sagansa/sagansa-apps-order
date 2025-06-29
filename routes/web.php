<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\DeliveryAddressController;
use App\Http\Controllers\EngineeringController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', [WelcomeController::class, 'index']);

Route::get('/food', function () {
    return Inertia::render('WelcomeFood');
});

Route::get('/engineering', [EngineeringController::class, 'index']);

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth'])->name('dashboard');

Route::get('/order', [OrderController::class, 'index'])->name('order.index');

Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

    Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');

    Route::get('/checkout-success', function (Request $request) {
        return Inertia::render('CheckoutSuccess', [
            'deliveryType' => $request->query('delivery_type'),
            'message' => $request->query('message')
        ]);
    })->name('checkout.success');

    // Location routes
    Route::prefix('locations')->group(function () {
        Route::get('/provinces', [LocationController::class, 'provinces'])->name('locations.provinces');
        Route::get('/cities', [LocationController::class, 'cities'])->name('locations.cities');
        Route::get('/districts', [LocationController::class, 'districts'])->name('locations.districts');
        Route::get('/subdistricts', [LocationController::class, 'subdistricts'])->name('locations.subdistricts');
        Route::get('/postal-code', [LocationController::class, 'postalCode'])->name('locations.postal-code');
    });

    // Delivery Address routes
    Route::resource('delivery-address', DeliveryAddressController::class)->only(['store', 'update', 'destroy']);

    Route::get('/transaction-history', [OrderController::class, 'orderHistory'])->name('transaction.history');

    Route::get('/order/{id}', [OrderController::class, 'show'])->name('order.show');

    Route::post('/order/{order}/update-payment', [OrderController::class, 'updatePayment'])->name('order.update-payment');
});

require __DIR__.'/auth.php';
