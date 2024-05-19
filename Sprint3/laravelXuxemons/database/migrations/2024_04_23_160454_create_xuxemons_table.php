<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('xuxemons', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 20);
            $table->string('tipo', 50);
            $table->string('archivo');
            $table->string('categoria', 15)->default('normal');
            $table->string('tamano')->default('pequeno');
            $table->integer('evo1')->nullable()->default(3);
            $table->integer('evo2')->nullable()->default(5);
            $table->timestamps();
        });

        DB::statement('ALTER TABLE xuxemons ADD CONSTRAINT check_evo1_max_value CHECK (evo1 <= 99)');
        DB::statement('ALTER TABLE xuxemons ADD CONSTRAINT check_evo2_max_value CHECK (evo2 <= 99)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE xuxemons DROP CONSTRAINT check_evo1_max_value');
        DB::statement('ALTER TABLE xuxemons DROP CONSTRAINT check_evo2_max_value');

        Schema::dropIfExists('xuxemons');
    }
};
