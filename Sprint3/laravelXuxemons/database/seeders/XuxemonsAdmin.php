<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class XuxemonsAdmin extends Seeder
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
            6,
            7
        ];

        for ($i = 0; $i < count($nombres); $i++) {

            DB::table('xuxemons_users')->insert([
                'xuxemon_id' => $nombres[$i],
                'user_id' => 1,
            ]);
        }
    }
}
