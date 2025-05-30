<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\DeliveryAddress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DeliveryAddressController extends Controller
{
    public function index()
    {
        return Inertia::render('DeliveryAddress/Index');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'recipient_name' => 'required|string|max:255',
            'recipient_telp_no' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
            'city_id' => 'required|exists:cities,id',
            'district_id' => 'required|exists:districts,id',
            'subdistrict_id' => 'required|exists:subdistricts,id',
            'postal_code_id' => 'required|exists:postal_codes,id',
            'address' => 'required|string|max:500',
        ]);

        $deliveryAddress = new DeliveryAddress($validatedData);
        $deliveryAddress->user_id = Auth::id();
        $deliveryAddress->for = 3;
        $deliveryAddress->save();

        // dd($deliveryAddress);

        return redirect()->route('cart.index');
    }

    public function update(Request $request, DeliveryAddress $deliveryAddress)
    {
        if ($deliveryAddress->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Cek apakah alamat sudah pernah digunakan untuk order
        if ($deliveryAddress->salesOrders()->count() > 0) {
            return redirect()->route('cart.index')->withErrors(['address' => 'Alamat ini sudah pernah digunakan untuk order dan tidak bisa diubah.']);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'recipient_name' => 'required|string|max:255',
            'recipient_telp_no' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
            'city_id' => 'required|exists:cities,id',
            'district_id' => 'required|exists:districts,id',
            'subdistrict_id' => 'required|exists:subdistricts,id',
            'postal_code_id' => 'required|exists:postal_codes,id',
            'address' => 'required|string|max:500',
        ]);

        $deliveryAddress->update($validatedData);

        return redirect()->route('cart.index');
    }

    public function destroy(DeliveryAddress $deliveryAddress)
    {
        if ($deliveryAddress->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }
        $deliveryAddress->delete();
        return redirect()->route('cart.index');
    }
}
