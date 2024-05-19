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
        Schema::create('xuxemons_users_enfermedades', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('xuxemon_user_id');
            $table->unsignedBigInteger('enfermedad_id');
            $table->timestamps();

            // Definir las claves foráneas
            $table->foreign('xuxemon_user_id')->references('id')->on('xuxemons_users')->onDelete('cascade');
            $table->foreign('enfermedad_id')->references('id')->on('enfermedades')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('endermedades_users');
    }
};
