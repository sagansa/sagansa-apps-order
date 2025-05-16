<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Province extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $guarded = [];

    public function cities()
    {
        return $this->hasMany(City::class);
    }

    public function deliveryAddresses()
    {
        return $this->hasMany(DeliveryAddress::class);
    }

    public function postalCodes()
    {
        return $this->hasMany(PostalCode::class);
    }
}
