<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\DeliveryAddressController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [App\Http\Controllers\WelcomeController::class, 'index']);

Route::get('/food', function () {
    return Inertia::render('WelcomeFood');
});

Route::get('/engineering', [App\Http\Controllers\EngineeringController::class, 'index']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

Route::get('/order', [App\Http\Controllers\OrderController::class, 'index'])->name('order.index');

Route::get('/product/{slug}', [App\Http\Controllers\ProductController::class, 'show'])->name('product.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

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
});

require __DIR__.'/auth.php';
