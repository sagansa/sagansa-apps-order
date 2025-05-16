<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DeliveryAddress extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $fillable = [
        'for',
        'name',
        'recipient_name',
        'recipient_telp_no',
        'address',
        'province_id',
        'city_id',
        'district_id',
        'subdistrict_id',
        'postal_code_id',
        'latitude',
        'longitude',
        'user_id',
    ];

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function subdistrict()
    {
        return $this->belongsTo(Subdistrict::class);
    }

    public function salesOrders()
    {
        return $this->hasMany(SalesOrder::class);
    }

    public function postalCode()
    {
        return $this->belongsTo(PostalCode::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($query) {
            $query->user_id = auth()->id();

            $query->user_id = auth()->id();
                if (auth()->user()->hasRole('customer')) {
                    $query->for = 1;
                } elseif (auth()->user()->hasRole('storage-staff')) {
                    $query->for = 3;
                } elseif (auth()->user()->hasRole('sales')) {
                    $query->for = 2;
                } else {
                    $query->for = null;
                }
        });
    }

    public function getDeliveryAddressNameAttribute()
    {
        $postalCode = $this->postalCode ? $this->postalCode->postal_code : '';
        $recipientsName = $this->recipient_name ?: '';
        $recipientTelpNo = $this->recipient_telp_no ?: '';
        $address = $this->address ?: '';
        $subdistrictName = $this->subdistrict ? $this->subdistrict->name : '';
        $districtName = $this->district ? $this->district->name : '';
        $provinceName = $this->province ? $this->province->name : '';
        $cityName = $this->city ? $this->city->name : '';

        return implode(PHP_EOL, [
            $this->name,
            $recipientsName . ' - ' . $recipientTelpNo,
            $address,
            $subdistrictName . ', ' . $districtName,
            $cityName . ', ' . $provinceName,
            $postalCode,
        ]);
    }

    public function getDeliveryAddressCoordinateAttribute()
    {
        return [
            $this->latitude . '; ' . $this->longitude
        ];
    }
}
