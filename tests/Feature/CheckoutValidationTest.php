<?php

namespace Tests\Feature;

use App\Models\DeliveryAddress;
use App\Models\DeliveryService;
use App\Models\Product;
use App\Models\SalesOrder;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Regression test untuk celah validasi checkout:
 * order pernah bisa dibuat tanpa satu pun produk (item dengan product_id dan
 * product_online_group_id sama-sama null di-skip diam-diam) dan order transfer
 * manual berstatus "Dibayar" bisa dibuat tanpa rekening tujuan & bukti transfer
 * ketika ongkir dibayar ke kurir.
 */
class CheckoutValidationTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Transaksi hanya untuk koneksi mysql. Insert user (mysql_auth) sengaja
     * di-commit langsung: FK delivery_addresses/sales_orders -> users akan
     * memblokir lintas koneksi jika baris parent belum di-commit (lock wait).
     * DB auth testing adalah klon sekali pakai, jadi kebocoran data aman.
     */
    protected $connectionsToTransact = ['mysql'];

    protected function makeUser(): User
    {
        return User::create([
            'name' => 'Checkout Test',
            'email' => 'checkout-test.' . uniqid() . '@example.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);
    }

    protected function makeAddress(User $user): DeliveryAddress
    {
        return DeliveryAddress::create([
            'user_id' => $user->id,
            'name' => 'Rumah Test',
            'recipient_name' => 'Penerima Test',
            'recipient_telp_no' => '081234567890',
            'address' => 'Jl. Test No. 1',
        ]);
    }

    protected function makeDeliveryService(): DeliveryService
    {
        return DeliveryService::create(['name' => 'Kurir Test ' . uniqid(), 'status' => 1]);
    }

    protected function makeProduct(User $user): Product
    {
        return Product::create([
            'name' => 'Produk Test ' . uniqid(),
            'online_price' => 50000,
            'request' => 0,
            'remaining' => 1,
            'user_id' => $user->id,
            'unit_id' => 1,
            'material_group_id' => 1,
            'online_category_id' => 1,
            'payment_type_id' => 1,
        ]);
    }

    public function test_checkout_menolak_item_tanpa_product_dan_group_id(): void
    {
        $user = $this->makeUser();
        $delivery = $this->makeDeliveryService();
        $address = $this->makeAddress($user);

        $response = $this->actingAs($user)->post(route('cart.checkout'), [
            'delivery_service_id' => $delivery->id,
            'delivery_address_id' => $address->id,
            'delivery_date' => now()->format('Y-m-d'),
            'payment_status' => 4,
            'payment_method' => 'manual_transfer',
            'items' => [
                [
                    // sengaja tanpa product_id & product_online_group_id
                    'quantity' => 1,
                    'price' => 0,
                ],
            ],
        ]);

        $response->assertInvalid();
        $this->assertFalse(
            SalesOrder::where('ordered_by_id', $user->id)->exists(),
            'Order tidak boleh terbuat dari item tanpa produk/grup.'
        );
    }

    public function test_checkout_manual_transfer_dibayar_tanpa_rekening_dan_bukti_ditolak(): void
    {
        $user = $this->makeUser();
        $delivery = $this->makeDeliveryService();
        $address = $this->makeAddress($user);
        $product = $this->makeProduct($user);

        $response = $this->actingAs($user)->post(route('cart.checkout'), [
            'delivery_service_id' => $delivery->id,
            'delivery_address_id' => $address->id,
            'delivery_date' => now()->format('Y-m-d'),
            'payment_status' => 1, // "Dibayar"
            'payment_method' => 'manual_transfer',
            'shipping_payment_method' => 'to_courier',
            'shipping_cost' => 0,
            // sengaja tanpa transfer_to_account_id & image_payment
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 1,
                    'price' => 50000,
                ],
            ],
        ]);

        $response->assertInvalid(['transfer_to_account_id', 'image_payment']);
        $this->assertFalse(
            SalesOrder::where('ordered_by_id', $user->id)->exists(),
            'Order "Dibayar" via transfer manual tidak boleh terbuat tanpa rekening & bukti transfer.'
        );
    }

    public function test_checkout_valid_membuat_order_dengan_detail_produk(): void
    {
        $user = $this->makeUser();
        $delivery = $this->makeDeliveryService();
        $address = $this->makeAddress($user);
        $product = $this->makeProduct($user);

        $response = $this->actingAs($user)->post(route('cart.checkout'), [
            'delivery_service_id' => $delivery->id,
            'delivery_address_id' => $address->id,
            'delivery_date' => now()->format('Y-m-d'),
            'payment_status' => 4, // belum dibayar — alur bayar nanti yang sah
            'payment_method' => 'manual_transfer',
            'shipping_payment_method' => 'to_courier',
            'shipping_cost' => 0,
            'items' => [
                [
                    'product_id' => $product->id,
                    'quantity' => 2,
                    'price' => 50000,
                ],
            ],
        ]);

        $response->assertValid();
        $order = SalesOrder::where('ordered_by_id', $user->id)->first();
        $this->assertNotNull($order, 'Order sah harus terbuat.');
        $this->assertSame(1, $order->detailSalesOrders()->count(), 'Order harus punya 1 baris detail.');
        $this->assertSame(100000, (int) $order->total_price, 'Total = subtotal tanpa ongkir & fee.');
    }
}
