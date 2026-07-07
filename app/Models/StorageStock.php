<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StorageStock extends Model
{
    protected $connection = 'mysql';
    protected $table = 'storage_stocks';
    protected $guarded = ['id'];

    public function productStorageStocks(): HasMany
    {
        return $this->hasMany(ProductStorageStock::class, 'storage_stock_id');
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }
}
