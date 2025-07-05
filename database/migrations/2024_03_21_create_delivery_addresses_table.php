<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('delivery_addresses')) {
            Schema::create('delivery_addresses', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('name');
                $table->string('recipient_name');
                $table->string('recipient_telp_no');
                $table->foreignId('province_id')->constrained()->onDelete('cascade');
                $table->foreignId('city_id')->constrained()->onDelete('cascade');
                $table->foreignId('district_id')->constrained()->onDelete('cascade');
                $table->foreignId('subdistrict_id')->constrained()->onDelete('cascade');
                $table->string('postal_code', 10);
                $table->text('address');
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('delivery_addresses');
    }
};
