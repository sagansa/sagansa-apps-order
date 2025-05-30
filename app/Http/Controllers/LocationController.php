<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Province;
use App\Models\City;
use App\Models\District;
use App\Models\Subdistrict;
use App\Models\PostalCode;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function provinces()
    {
        return response()->json(Province::select('id', 'name')->get());
    }

    public function cities(Request $request)
    {
        return response()->json(
            City::where('province_id', $request->province_id)
                ->select('id', 'name', 'province_id')
                ->get()
        );
    }

    public function districts(Request $request)
    {
        return response()->json(
            District::where('city_id', $request->city_id)
                ->select('id', 'name', 'city_id')
                ->get()
        );
    }

    public function subdistricts(Request $request)
    {
        return response()->json(
            Subdistrict::where('district_id', $request->district_id)
                ->select('id', 'name', 'district_id')
                ->get()
        );
    }

    public function postalCode(Request $request)
    {
        $postalCode = PostalCode::where('subdistrict_id', $request->subdistrict_id)
            ->select('postal_code')
            ->first();

        return response()->json([
            'postal_code' => $postalCode ? $postalCode->postal_code : null
        ]);
    }
}
