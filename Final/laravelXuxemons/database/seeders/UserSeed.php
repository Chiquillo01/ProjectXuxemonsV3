<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class UserSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'idUser'=> 'sl4J2i',
            'nick' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123456Ab.'),
            'rol' => 1,
        ]);

        DB::table('users')->insert([
            'idUser'=> 'nd7Sj2',
            'nick' => 'usuario',
            'email' => 'usuario@gmail.com',
            'password' => Hash::make('123456Ab.'),
            'rol' => 0,
        ]);
    }
}
