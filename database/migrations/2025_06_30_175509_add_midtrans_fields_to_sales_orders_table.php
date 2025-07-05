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
            $table->string('status')->default('pending')->after('delivery_status'); // e.g., pending, paid, cancelled
            $table->string('midtrans_snap_token')->nullable()->after('status');
            $table->string('midtrans_transaction_id')->nullable()->after('midtrans_snap_token');
            $table->string('midtrans_status')->nullable()->after('midtrans_transaction_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_orders', function (Blueprint $table) {
            $table->dropColumn(['status', 'midtrans_snap_token', 'midtrans_transaction_id', 'midtrans_status']);
        });
    }
};
