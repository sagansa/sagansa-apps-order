<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TransferToAccount extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function bank()
    {
        return $this->belongsTo(Bank::class);
    }

    public function salesOrders()
    {
        return $this->hasMany(SalesOrder::class);
    }

    public function getTransferNameAttribute()
    {
        return $this->bank->name . ' - ' . $this->number . ' - ' . $this->name;
    }

    public function getTransferAccountNameAttribute()
    {
        return $this->bank->name . ' - ' . $this->number;
    }
}
