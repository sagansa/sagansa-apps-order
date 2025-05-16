<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cart;
use App\Models\Product;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = Cart::where('user_id', auth()->id())
            ->with('product')
            ->get();

        return Inertia::render('Cart', [
            'cart_items' => $cartItems
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1',
            ]);

            if ($request->quantity < 1) {
                if ($request->wantsJson()) {
                    return response()->json(['error' => 'Jumlah produk tidak valid'], 422);
                }
                return back()->with('error', 'Invalid product quantity');
            }

            if (!auth()->check()) {
                if ($request->wantsJson()) {
                    return response()->json(['error' => 'Silakan login terlebih dahulu'], 401);
                }
                return Inertia::location(route('login'));
            }

            $product = Product::findOrFail($request->product_id);

            $cart = Cart::updateOrCreate(
                [
                    'user_id' => auth()->id(),
                    'product_id' => $request->product_id
                ],
                [
                    'quantity' => $request->quantity,
                ]
            );

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Produk berhasil ditambahkan ke keranjang']);
            }

            return redirect()->route('cart.index')->with('success', 'Produk berhasil ditambahkan ke keranjang');
        } catch (\Illuminate\Validation\ValidationException $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 422);
            }
            return back()->withErrors($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Produk tidak ditemukan'], 404);
            }
            return back()->with('error', 'Product not found');
        } catch (\Exception $e) {
            \Log::error('Cart addition failed: ' . $e->getMessage());
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Gagal menambahkan produk ke keranjang'], 500);
            }
            return back()->with('error', 'Failed to add product to cart');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1',
            ]);

            $cart = Cart::findOrFail($id);

            if ($cart->user_id !== auth()->id()) {
                if ($request->wantsJson()) {
                    return response()->json(['error' => 'Anda tidak memiliki izin untuk mengubah produk ini'], 403);
                }
                return back()->with('error', 'Anda tidak memiliki izin untuk mengubah produk ini');
            }

            $cart->update([
                'quantity' => $request->quantity
            ]);

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Jumlah produk berhasil diperbarui']);
            }

            return back()->with('success', 'Jumlah produk berhasil diperbarui');
        } catch (\Illuminate\Validation\ValidationException $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => $e->getMessage()], 422);
            }
            return back()->withErrors($e->errors());
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Produk tidak ditemukan di keranjang'], 404);
            }
            return back()->with('error', 'Produk tidak ditemukan di keranjang');
        } catch (\Exception $e) {
            \Log::error('Cart update failed: ' . $e->getMessage());
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Gagal memperbarui jumlah produk'], 500);
            }
            return back()->with('error', 'Gagal memperbarui jumlah produk');
        }
    }

    public function destroy($id)
    {
        $cart = Cart::findOrFail($id);
        if ($cart->user_id !== auth()->id()) {
            return response()->json(['error' => 'Anda tidak memiliki izin untuk menghapus produk ini'], 403);
        }
        $cart->delete();
    }
}
