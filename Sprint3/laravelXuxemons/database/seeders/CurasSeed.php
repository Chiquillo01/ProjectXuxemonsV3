<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurasSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nombres = [
            'Xocolatina',
            'Inxulina',
            'Xal de frutas'
        ];

        $url = [
            'syringe.png',
            'medicine.png',
            'sugar.png'
        ];

        for ($i = 0; $i < count($nombres); $i++) {

            DB::table('curas')->insert([
                'nombre' => $nombres[$i],
                'categoria' => 'curacion',
                'archivo' => strtolower($url[$i]),
            ]);
        }
    }
}
