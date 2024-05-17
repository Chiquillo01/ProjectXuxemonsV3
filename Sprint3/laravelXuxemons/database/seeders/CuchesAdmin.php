<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class CuchesAdmin extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nombres = [
            1,
            2,
            3,
            4,
            5,
            6
        ];
        $stack = [
            6,
            8,
            5,
            3,
            8,
            7
        ];

        for ($i = 0; $i < count($nombres); $i++) {

            DB::table('chuches_users')->insert([
                'chuche_id' => $nombres[$i],
                'user_id' => 1,
                'stack' => $stack[$i],
            ]);
        }
    }
}
