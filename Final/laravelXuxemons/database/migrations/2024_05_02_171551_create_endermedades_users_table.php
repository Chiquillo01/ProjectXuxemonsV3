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
        Schema::create('enfermedades_users', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('xuxemon_id');
            $table->unsignedBigInteger('enfermedad_id');
            $table->boolean('infectado')->default(false);
            $table->timestamps();

            // Definir las claves foráneas
            $table->foreign('xuxemon_id')->references('id')->on('xuxemons')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
