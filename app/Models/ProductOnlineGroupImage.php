<?php

namespace App\Models;

use App\Support\PublicStorageUrl;
use Illuminate\Database\Eloquent\Model;

class ProductOnlineGroupImage extends Model
{
    protected $connection = 'mysql';

    protected $table = 'product_online_group_product_image';

    public $timestamps = false;

    protected $fillable = ['product_online_group_id', 'product_image_id', 'order'];

    // image_url wajib di-append supaya tersedia saat pivot diserialisasi ke JSON
    // untuk Inertia (frontend membaca group.images[].image_url). Tanpa ini accessor
    // getImageUrlAttribute() tidak pernah dikirim ke client -> gambar tidak muncul.
    protected $appends = ['image_url'];

    public function group()
    {
        return $this->belongsTo(ProductOnlineGroup::class, 'product_online_group_id');
    }

    public function image()
    {
        return $this->belongsTo(ProductImage::class, 'product_image_id');
    }

    public function getImageUrlAttribute()
    {
        return $this->image?->image_url ?? 'https://placehold.co/600x400?text=No+Image';
    }
}
