<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Akses read-only ke invoice purchase internal Sagansa.
 *
 * Order pembeli bisa dikaitkan dengan invoice purchase (kolom
 * `sales_order_id`) yang image-nya berupa foto resi pengiriman — dibuat
 * oleh tim internal lewat app lain. Dari sini hanya dibaca image-nya;
 * penulisan tidak pernah dilakukan lewat apps/order.
 */
class InvoicePurchase extends Model
{
    protected $table = 'invoice_purchases';

    protected $guarded = [];
}
