<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserSeed::class);
        $this->call(XuxemonsSeed::class);
        $this->call(ChuchesSeed::class);
        $this->call(CurasSeed::class);
        $this->call(CuchesAdmin::class);
        $this->call(XuxemonsAdmin::class);
        $this->call(EnfermedadesSeed::class);
        $this->call(ChatSeed::class);
    }
}
