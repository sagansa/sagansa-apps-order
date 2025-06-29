<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SalesOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'for',
        'delivery_date',
        'delivery_service_id',
        'delivery_address_id',
        'transfer_to_account_id',
        'image_payment',
        'payment_status',
        'delivery_status',
        'shipping_cost',
        'store_id',
        'receipt_no',
        'image_delivery',
        'ordered_by_id',
        'assigned_by_id',
        'notes',
        'total_price',
        'received_by',
    ];

    public function deliveryService()
    {
        return $this->belongsTo(DeliveryService::class);
    }

    public function transferToAccount()
    {
        return $this->belongsTo(TransferToAccount::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function orderedBy()
    {
        return $this->belongsTo(User::class, 'ordered_by_id');
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by_id');
    }

    public function deliveryAddress()
    {
        return $this->belongsTo(DeliveryAddress::class);
    }

    public function detailSalesOrders()
    {
        return $this->hasMany(DetailSalesOrder::class);
    }
}
