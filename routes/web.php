<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\DeliveryAddressController;
use App\Http\Controllers\EngineeringController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

Route::post('/midtrans/callback', [\App\Http\Controllers\Api\MidtransController::class, 'midtransCallback'])->name('midtrans.callback');
Route::post('/midtrans/recurring', [\App\Http\Controllers\Api\MidtransController::class, 'midtransRecurring'])->name('midtrans.recurring');
Route::post('/midtrans/account-linking', [\App\Http\Controllers\Api\MidtransController::class, 'midtransAccountLinking'])->name('midtrans.account-linking');

Route::get('/', [OrderController::class, 'index'])->name('order.index');

Route::get('/order', function (Request $request) {
    $filters = collect($request->query())
        ->reject(function ($value, $key) {
            return match ($key) {
                'category', 'unit' => $value === null || $value === '' || $value === 'all',
                'min_price', 'max_price', 'search' => $value === null || $value === '' || $value === '0',
                default => $value === null || $value === '',
            };
        })
        ->all();

    return redirect()->route('order.index', $filters);
})->name('order.redirect');

Route::get('/food', function () {
    return Inertia::render('WelcomeFood');
});

Route::get('/engineering', [EngineeringController::class, 'index']);

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth'])->name('dashboard');

Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::put('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

    Route::get('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout.form');
    Route::post('/cart/checkout', [CartController::class, 'checkout'])->name('cart.checkout');
    Route::post('/cart/card-token', [CartController::class, 'getCardToken'])->name('cart.card-token');

    Route::get('/checkout-success', function (Request $request) {
        $orderId = $request->query('order');
        $salesOrder = null;
        $midtransPayment = null;

        if ($orderId) {
            $salesOrder = \App\Models\SalesOrder::with(['transferToAccount.bank', 'detailSalesOrders.product', 'orderedBy'])
                ->where('ordered_by_id', $request->user()->id)
                ->find($orderId);

            if ($salesOrder && $salesOrder->midtrans_response) {
                $midtransPayment = json_decode($salesOrder->midtrans_response, true);
            }
        }

        Log::info('CheckoutSuccess page loaded', [
            'orderId' => $orderId,
            'salesOrderFound' => $salesOrder ? $salesOrder->id : null,
            'hasMidtransPayment' => !is_null($midtransPayment),
        ]);

        return Inertia::render('CheckoutSuccess', [
            'sales_order' => $salesOrder,
            'midtrans_payment' => $midtransPayment,
            'debug_orderId' => $orderId,
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
    Route::resource('delivery-address', DeliveryAddressController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('/transaction-history', [OrderController::class, 'orderHistory'])->name('transaction.history');

    Route::get('/transaction-detail/{id}', [OrderController::class, 'show'])->name('order.show');
    Route::post('/transaction/{id}/regenerate-payment', [OrderController::class, 'regeneratePayment'])->name('order.regenerate-payment');

    Route::post('/order/{order}/update-payment', [OrderController::class, 'updatePayment'])->name('order.update-payment');
    Route::post('/sales-order/{salesOrder}/set-manual-transfer', [OrderController::class, 'setManualTransfer'])->name('sales-order.set-manual-transfer');


});

Route::get('/privacy-policy', function () {
    return Inertia::render('Legal/PrivacyPolicy');
})->name('privacy.policy');

Route::get('/terms-of-service', function () {
    return Inertia::render('Legal/TermsOfService');
})->name('terms.service');

require __DIR__.'/auth.php';
