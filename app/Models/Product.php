<?php

namespace App\Models;

use App\Support\PublicStorageUrl;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class Product extends Model
{
    protected $connection = 'mysql';

    use HasFactory;
    use SoftDeletes;

    protected $guarded = ['id'];
    protected $appends = ['image_url', 'current_stock'];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detailSalesOrders()
    {
        return $this->hasMany(DetailSalesOrder::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function onlineCategory()
    {
        return $this->belongsTo(OnlineCategory::class);
    }

    public function getImageUrlAttribute()
    {
        return PublicStorageUrl::from(
            $this->attributes['image'] ?? null,
            'https://placehold.co/600x400?text=No+Image'
        );
    }

    public static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name);
            }
        });
    }

    public function getProductNameAttribute()
    {
        $unitName = $this->unit ? $this->unit->unit : '';
        return $this->name . ($unitName ? ' - ' . $unitName : '');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    public function priceTiers()
    {
        return $this->hasMany(PriceTier::class)->orderBy('min_quantity');
    }

    public function getPriceByQuantity($quantity)
    {
        $tier = $this->priceTiers()
            ->where('min_quantity', '<=', $quantity)
            ->where(function ($query) use ($quantity) {
                $query->whereNull('max_quantity')
                    ->orWhere('max_quantity', '>=', $quantity);
            })
            ->orderByDesc('min_quantity')
            ->first();

        return $tier ? $tier->price : ($this->online_price ?? 0);
    }

    public function storageStocks()
    {
        return $this->belongsToMany(StorageStock::class, 'product_storage_stock')
            ->withPivot('quantity');
    }

    public function scopeAvailable(Builder $query): Builder
    {
        $outOfStockIds = self::getOutOfStockProductIds();

        if ($outOfStockIds->isNotEmpty()) {
            return $query->whereNotIn('products.id', $outOfStockIds);
        }

        return $query;
    }

    private static function getOutOfStockProductIds(): \Illuminate\Support\Collection
    {
        if (!Schema::hasTable('storage_stocks') || !Schema::hasTable('product_storage_stock')) {
            return collect();
        }

        $latestStockIds = DB::table('storage_stocks')
            ->selectRaw('MAX(id) as id')
            ->groupBy('store_id')
            ->pluck('id');

        if ($latestStockIds->isEmpty()) {
            return collect();
        }

        return DB::table('product_storage_stock')
            ->whereIn('storage_stock_id', $latestStockIds)
            ->select('product_id')
            ->selectRaw('SUM(quantity) as total')
            ->groupBy('product_id')
            ->having('total', '=', 0)
            ->pluck('product_id');
    }

    public function getCurrentStockAttribute(): ?int
    {
        if (!Schema::hasTable('storage_stocks') || !Schema::hasTable('product_storage_stock')) {
            return null;
        }

        $latestStockIds = DB::table('storage_stocks')
            ->selectRaw('MAX(id) as id')
            ->groupBy('store_id')
            ->pluck('id');

        if ($latestStockIds->isEmpty()) {
            return null;
        }

        $exists = DB::table('product_storage_stock')
            ->whereIn('storage_stock_id', $latestStockIds)
            ->where('product_id', $this->id)
            ->exists();

        if (!$exists) {
            return null;
        }

        $total = DB::table('product_storage_stock')
            ->whereIn('storage_stock_id', $latestStockIds)
            ->where('product_id', $this->id)
            ->sum('quantity');

        return (int) $total;
    }
}
