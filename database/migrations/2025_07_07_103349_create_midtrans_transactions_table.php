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
        Schema::create('midtrans_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_id')->constrained()->onDelete('cascade');
            $table->string('transaction_id')->unique();
            $table->string('status_code');
            $table->decimal('gross_amount', 15, 2);
            $table->string('payment_type');
            $table->string('transaction_status');
            $table->string('fraud_status');
            $table->string('signature_key');
            $table->dateTime('transaction_time');
            $table->string('bank')->nullable();
            $table->string('masked_card')->nullable();
            $table->json('va_numbers')->nullable(); // Store Virtual Account numbers as JSON
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('midtrans_transactions');
    }
};
