<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DetailSalesOrder extends Model
{
    protected $connection = 'mysql';

    use HasFactory;

    protected $fillable = [
        'sales_order_id',
        'product_id',
        'product_online_group_id',
        'quantity',
        'unit_price',
        'subtotal_price',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function productOnlineGroup()
    {
        return $this->belongsTo(ProductOnlineGroup::class);
    }

    public function salesOrder()
    {
        return $this->belongsTo(SalesOrder::class);
    }
}
