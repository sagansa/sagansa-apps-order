<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PostalCode;
use App\Models\Subdistrict;

class PostalCodeSeeder extends Seeder
{
    public function run()
    {
        // Sample postal codes for testing
        // In production, you would import real postal code data
        $subdistricts = Subdistrict::all();
        
        foreach ($subdistricts as $subdistrict) {
            // Generate a sample postal code (in real scenario, use actual data)
            $postalCode = str_pad(rand(10000, 99999), 5, '0', STR_PAD_LEFT);
            
            PostalCode::create([
                'province_id' => $subdistrict->province_id,
                'city_id' => $subdistrict->city_id,
                'district_id' => $subdistrict->district_id,
                'subdistrict_id' => $subdistrict->id,
                'postal_code' => $postalCode,
            ]);
        }
    }
}