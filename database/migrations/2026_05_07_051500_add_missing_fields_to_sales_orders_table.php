<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sales_orders', function (Blueprint $table) {
            if (!Schema::hasColumn('sales_orders', 'status')) {
                $table->string('status')->default('pending')->after('delivery_status');
            }
            if (!Schema::hasColumn('sales_orders', 'midtrans_status')) {
                $table->string('midtrans_status')->nullable()->after('status');
            }
            if (!Schema::hasColumn('sales_orders', 'payment_method')) {
                $table->string('payment_method')->nullable()->after('midtrans_status');
            }
            if (!Schema::hasColumn('sales_orders', 'shipping_payment_method')) {
                $table->string('shipping_payment_method')->nullable()->after('payment_method');
            }
            if (!Schema::hasColumn('sales_orders', 'midtrans_snap_token')) {
                $table->string('midtrans_snap_token')->nullable()->after('shipping_payment_method');
            }
            if (!Schema::hasColumn('sales_orders', 'midtrans_transaction_id')) {
                $table->string('midtrans_transaction_id')->nullable()->after('midtrans_snap_token');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_orders', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'midtrans_status',
                'payment_method',
                'shipping_payment_method',
                'midtrans_snap_token',
                'midtrans_transaction_id'
            ]);
        });
    }
};
