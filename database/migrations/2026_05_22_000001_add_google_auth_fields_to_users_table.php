<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'mysql_auth';

    public function up(): void
    {
        Schema::connection('mysql_auth')->table('users', function (Blueprint $table) {
            if (! Schema::connection('mysql_auth')->hasColumn('users', 'uuid')) {
                $table->uuid('uuid')->nullable()->unique()->after('id');
            }

            if (! Schema::connection('mysql_auth')->hasColumn('users', 'google_id')) {
                $table->string('google_id')->nullable()->unique()->after('password');
            }

            if (! Schema::connection('mysql_auth')->hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('google_id');
            }

            if (! Schema::connection('mysql_auth')->hasColumn('users', 'phone_number')) {
                $table->string('phone_number', 20)->nullable()->after('avatar');
            }
        });

        DB::connection('mysql_auth')->statement('ALTER TABLE users MODIFY password VARCHAR(255) NULL');
    }

    public function down(): void
    {
        Schema::connection('mysql_auth')->table('users', function (Blueprint $table) {
            if (Schema::connection('mysql_auth')->hasColumn('users', 'phone_number')) {
                $table->dropColumn('phone_number');
            }

            if (Schema::connection('mysql_auth')->hasColumn('users', 'avatar')) {
                $table->dropColumn('avatar');
            }

            if (Schema::connection('mysql_auth')->hasColumn('users', 'google_id')) {
                $table->dropColumn('google_id');
            }

            if (Schema::connection('mysql_auth')->hasColumn('users', 'uuid')) {
                $table->dropColumn('uuid');
            }
        });

        DB::connection('mysql_auth')->statement('ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL');
    }
};
