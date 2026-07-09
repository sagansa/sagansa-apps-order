<?php

namespace App\Models;

use App\Support\PublicStorageUrl;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductImage extends Model
{
    protected $connection = 'mysql';

    use HasFactory;

    protected $fillable = ['product_id', 'image_url', 'order'];

    // image_url wajib di-append supaya tersedia saat ProductImage diserialisasi ke
    // JSON untuk Inertia, baik sebagai product.images[].image_url maupun nested
    // group.images[].image.image_url. Tanpa ini frontend tidak menerima URL gambar.
    protected $appends = ['image_url'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getImageUrlAttribute()
    {
        return PublicStorageUrl::from(
            $this->attributes['image_url'] ?? null,
            'https://placehold.co/600x400?text=No+Image'
        );
    }
}
