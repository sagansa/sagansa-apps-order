<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MidtransController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController; // Import OrderController

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/midtrans/snap-token', [MidtransController::class, 'generateSnapToken']);
});

// Midtrans callback route - should be publicly accessible
Route::post('/midtrans/callback', [CartController::class, 'midtransCallback']);
