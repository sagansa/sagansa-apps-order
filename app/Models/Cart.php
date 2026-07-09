<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cart extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'user_id',
        'product_id',
        'product_online_group_id',
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

    public function productOnlineGroup(): BelongsTo
    {
        return $this->belongsTo(ProductOnlineGroup::class);
    }
}
