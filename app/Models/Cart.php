<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // protected static function boot()
    // {
    //     parent::boot();

    //     static::creating(function ($cart) {
    //         $cart->total_price = $cart->price * $cart->quantity;
    //     });

    //     static::updating(function ($cart) {
    //         $cart->total_price = $cart->price * $cart->quantity;
    //     });
    // }
}
