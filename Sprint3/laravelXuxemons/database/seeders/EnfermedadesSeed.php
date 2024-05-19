<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnfermedadesSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nombres = [
            'Bajon de azucar',
            'Sobredosis de azucar',
            'Atracon'
        ];

        for ($i = 0; $i < count($nombres); $i++) {

            DB::table('enfermedades')->insert([
                'nombre' => $nombres[$i],
            ]);
        }
    }
}
