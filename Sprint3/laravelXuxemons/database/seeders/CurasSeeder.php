<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nombres = [
            'Xal de frutas', 'Inxulina', 'Xocolatina'
        ];


        $enfermedades = [
            'Atracón', 'Sobredosis de azúcar', 'Bajón de azúcar'
        ];

        $url = [
            'syringe.png', 'medicine.png', 'sugar.png'
        ];

        for ($i = 0; $i < count($nombres); $i++) {

            DB::table('curas')->insert([
                'nombre' => $nombres[$i],
                'enfermedad' => $enfermedades[$i],
                'archivo' => strtolower($url[$i]),
            ]);
        }
    }
}
