<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MidtransController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/midtrans/snap-token', [MidtransController::class, 'generateSnapToken']);
Route::post('/midtrans/callback', [MidtransController::class, 'midtransCallback']);
