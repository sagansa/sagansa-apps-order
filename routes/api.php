<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MidtransController;

Route::post('/midtrans/callback', [MidtransController::class, 'midtransCallback'])->name('api.midtrans.callback');
Route::post('/midtrans/recurring', [MidtransController::class, 'midtransRecurring'])->name('api.midtrans.recurring');
Route::post('/midtrans/account-linking', [MidtransController::class, 'midtransAccountLinking'])->name('api.midtrans.account-linking');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});


