<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\DeliveryService;
use App\Models\DeliveryAddress;
use App\Models\TransferToAccount;
use App\Models\SalesOrder;
use App\Models\DetailSalesOrder;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = Cart::with(['product.priceTiers', 'product.unit'])
            ->where('user_id', $request->user()->id)
                ->get();

        $deliveryServices = DeliveryService::all();

        $deliveryAddresses = DeliveryAddress::with(['province', 'city', 'district', 'subdistrict', 'postalCode'])
            ->where('user_id', $request->user()->id)
                ->get();

        $transferToAccounts = TransferToAccount::with('bank')->get();

            return Inertia::render('Cart', [
            'cartItems' => $cartItems,
            'deliveryServices' => $deliveryServices,
            'deliveryAddresses' => $deliveryAddresses,
            'transferToAccounts' => $transferToAccounts,
        ]);
    }

    public function update(Request $request, Cart $cart)
    {
        if ($cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cart->update([
            'quantity' => $request->quantity
        ]);

        return back();
    }

    public function destroy(Request $request, Cart $cart)
    {
        if ($cart->user_id !== $request->user()->id) {
            abort(403);
        }

        $cart->delete();
        return back();
    }

    public function store(Request $request)
    {
            $request->validate([
                'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        // Cek apakah produk sudah ada di keranjang
        $existingCart = Cart::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingCart) {
            // Update quantity jika produk sudah ada
            $existingCart->update([
                'quantity' => $existingCart->quantity + $request->quantity
            ]);
        } else {
            // Buat cart baru jika produk belum ada
            Cart::create([
                'user_id' => $request->user()->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        return back()->with('success', 'Produk berhasil ditambahkan ke keranjang!');
    }

    public function checkout(Request $request)
    {
        return DB::transaction(function () use ($request) {
            // Validasi Dasar
            $validated = $request->validate([
                'delivery_service_id' => 'required|exists:delivery_services,id',
                // delivery_address_id dan transfer_to_account_id divalidasi kondisional setelah ini
                'delivery_address_id' => 'nullable|exists:delivery_addresses,id',
                'transfer_to_account_id' => 'nullable|exists:transfer_to_accounts,id',
                'delivery_date' => 'required|date|after_or_equal:today',
                // image_payment divalidasi kondisional
                'image_payment' => 'nullable|image|max:2048',
                // shipping_cost divalidasi kondisional
                'shipping_cost' => 'nullable|numeric|min:0',
                'payment_status' => 'required|integer|in:1,4', // Pastikan hanya menerima status 1 atau 4 dari frontend
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
            ]);

            $isSelfPickup = $validated['delivery_service_id'] == 33;
            $paymentStatus = $validated['payment_status'];
            $shippingCost = $validated['shipping_cost'] ?? 0;

            // Validasi Kondisional berdasarkan Metode Pengiriman dan Status Pembayaran
            if (!$isSelfPickup) { // Metode Pengiriman: Selain Ambil Sendiri
                // Wajib ada alamat pengiriman
                if (empty($validated['delivery_address_id'])) {
                    return back()->withErrors(['delivery_address_id' => 'Alamat pengiriman wajib dipilih untuk metode pengiriman ini.']);
                }

                // Jika status pembayaran 1 dan ongkir > 0 (dibayar via platform)
                if ($paymentStatus == 1 && $shippingCost > 0) { // Ditambah kondisi $shippingCost > 0
                    // Wajib ada rekening tujuan transfer
                     if (empty($validated['transfer_to_account_id'])) {
                         return back()->withErrors(['transfer_to_account_id' => 'Rekening tujuan transfer wajib dipilih.']);
                     }
                    // Wajib ada bukti transfer jika status 1 dan ongkir > 0
                    if (!$request->hasFile('image_payment')) {
                         return back()->withErrors(['image_payment' => 'Bukti transfer wajib diupload untuk status pembayaran ini.']);
                    }

                } elseif ($paymentStatus == 4) { // Pengiriman + Belum Konfirmasi Ongkir (Status 4)
                    // Tidak perlu rekening tujuan transfer atau bukti transfer di tahap ini
                     $shippingCost = 0; // Pastikan disimpan 0 jika status 4
                     $validated['transfer_to_account_id'] = null; // Pastikan null di backend
                     $validated['image_payment'] = null; // Pastikan null di backend
                 }
                 // Jika status pembayaran 1 dan ongkir 0 (dibayar ke kurir), tidak wajib rekening/bukti transfer

            } else { // Metode Pengiriman: Ambil Sendiri (isSelfPickup = true, ID 33)
                 // Tidak perlu alamat pengiriman
                 $validated['delivery_address_id'] = null; // Pastikan null di backend

                // Wajib ada rekening tujuan transfer
                 if (empty($validated['transfer_to_account_id'])) {
                     return back()->withErrors(['transfer_to_account_id' => 'Rekening tujuan transfer wajib dipilih untuk metode ambil sendiri.']);
                 }

                 if ($paymentStatus == 1) { // Ambil Sendiri + Bukti Upload (Status 1)
                     // Wajib ada bukti transfer jika status 1
                     if (!$request->hasFile('image_payment')) {
                          return back()->withErrors(['image_payment' => 'Bukti transfer wajib diupload untuk status pembayaran ini.']);
                     }
                 } elseif ($paymentStatus == 4) { // Ambil Sendiri + Belum Upload Bukti Transfer (Status 4)
                     // Tidak perlu bukti transfer di tahap ini
                      $validated['image_payment'] = null; // Pastikan null di backend
                 }
                // shipping_cost selalu 0 untuk Ambil Sendiri
                 $shippingCost = 0;
             }

             // Hitung Subtotal dan Total Price
            $subtotal = array_reduce($validated['items'], function ($sum, $item) {
                return $sum + ($item['quantity'] * $item['price']);
            }, 0);

            // Total price dihitung dari subtotal + shipping_cost yang sudah disesuaikan
            $totalPrice = $subtotal + $shippingCost;

            $imagePaymentPath = null;
            // Hanya simpan file jika ada dan validasinya lolos (status 1)
            if ($paymentStatus == 1 && $request->hasFile('image_payment')) {
                $imagePaymentPath = $request->file('image_payment')->store('payments', 'public');
            }

            $order = SalesOrder::create([
                'ordered_by_id' => $request->user()->id,
                'delivery_service_id' => $validated['delivery_service_id'],
                'delivery_address_id' => $validated['delivery_address_id'],
                'transfer_to_account_id' => $validated['transfer_to_account_id'],
                'delivery_date' => $validated['delivery_date'],
                'total_price' => $totalPrice,
                'shipping_cost' => $shippingCost, // Gunakan nilai shippingCost yang sudah disesuaikan
                'payment_status' => $paymentStatus, // Gunakan paymentStatus dari frontend
                'delivery_status' => '1', // Status awal pesanan (misal: diproses)
                'image_payment' => $imagePaymentPath,
            ]);

            foreach ($validated['items'] as $item) {
                DetailSalesOrder::create([
                    'sales_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal_price' => $item['quantity'] * $item['price'],
                ]);
            }

            Cart::where('user_id', $request->user()->id)->delete();

            // Logika pesan redirect berdasarkan payment_status
            $message = ($order->payment_status == 4)
                ? 'Pesanan berhasil dibuat! Admin akan segera menghubungi Anda untuk konfirmasi biaya ongkos kirim dan total pembayaran.'
                : ($isSelfPickup
                    ? 'Pesanan berhasil dibuat dan segera diproses! Silakan lakukan pembayaran atau ambil pesanan di toko kami sesuai dengan tanggal yang telah ditentukan.'
                    : 'Pesanan berhasil dibuat dan segera diproses! Silakan lakukan pembayaran sesuai instruksi.');

            return redirect()->route('checkout.success', [
                'delivery_type' => $isSelfPickup ? 'self_pickup' : 'delivery',
                'message' => $message,
                'order_id' => $order->id,
            ])->with('success', 'Pesanan berhasil dibuat!');
        });
    }
}
