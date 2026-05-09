<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('postal_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('province_id')->constrained()->onDelete('cascade');
            $table->foreignId('city_id')->constrained()->onDelete('cascade');
            $table->foreignId('district_id')->constrained()->onDelete('cascade');
            $table->foreignId('subdistrict_id')->constrained()->onDelete('cascade');
            $table->string('postal_code', 10);
            $table->unique(['subdistrict_id', 'postal_code']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('postal_codes');
    }
};