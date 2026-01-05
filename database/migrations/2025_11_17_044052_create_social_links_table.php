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
        Schema::create('social_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_setting_id')->constrained('site_settings')->onDelete('cascade');
            $table->string('platform')->comment('Platform name (e.g., Facebook, Instagram, Twitter)');
            $table->string('url');
            $table->string('icon')->nullable()->comment('Icon class or image path');
            $table->integer('order')->default(0)->comment('Display order');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['site_setting_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_links');
    }
};
