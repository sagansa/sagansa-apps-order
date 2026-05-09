<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('delivery_addresses', function (Blueprint $table) {
            // Drop the old postal_code string column
            $table->dropColumn('postal_code');
            
            // Add the new postal_code_id foreign key column
            $table->foreignId('postal_code_id')->constrained('postal_codes')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('delivery_addresses', function (Blueprint $table) {
            // Drop the foreign key constraint and column
            $table->dropForeign(['postal_code_id']);
            $table->dropColumn('postal_code_id');
            
            // Add back the old postal_code string column
            $table->string('postal_code', 10);
        });
    }
};