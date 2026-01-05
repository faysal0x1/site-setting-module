<?php

declare(strict_types=1);

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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();

            $table->string('logo')->nullable();
            $table->string('icon')->nullable();
            $table->string('phone1')->nullable();
            $table->string('phone2')->nullable();

            $table->string('email1')->nullable();
            $table->string('email2')->nullable();

            $table->string('company_name')->nullable();
            $table->string('company_address')->nullable();

            $table->string('map_api')->nullable();

            $table->string('facebook')->nullable();
            $table->string('pinterest')->nullable();
            $table->string('instagram')->nullable();

            $table->string('youtube')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
