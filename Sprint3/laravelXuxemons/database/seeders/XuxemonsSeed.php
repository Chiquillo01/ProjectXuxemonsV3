<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class XuxemonsSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $nombres = [
            'Apleki', 'Avecrem', 'Beeboo', 'Boo-hoot', 'Cabrales', 'Catua',
            'Catyuska', 'Chapapá', 'Chopper', 'Deskangoo', 'Doflamingo', 'Dolly', 
            'Elconchudo', 'Eldientes', 'Flipper',  'Floppi', 'Horseluis', 'Krokolisko', 
            'Kurama', 'Ladybug', 'Lengualargui', 'Trompi', 'Meekmeek', 'Megalo', 
            'Mocha', 'Murcimurci', 'Nemo', 'Oinkcelot', 'Oreo', 'Otto', 
            'Pinchimott', 'Tux', 'Posón', 'Quakko', 'Ron', 'Sesssi', 
            'Shelly', 'Sirucco', 'Torcas', 'Trompeta', 'Elgominas',
            'Rajoy', 'Rawlion', 'Cuellilargui', 'Bambino', 'Rexxo', 'Medusation', 'Pollis',
        ];


        $tipo = [
            'Tierra', 'Aire', 'Aire', 'Aire', 'Tierra', 'Aire',
            'Aire', 'Agua', 'Tierra', 'Tierra', 'Aire', 'Tierra',
            'Agua', 'Agua', 'Agua', 'Tierra',  'Agua', 'Agua',
            'Tierra', 'Aire', 'Tierra', 'Tierra', 'Tierra', 'Agua',
            'Agua', 'Aire', 'Agua', 'Tierra', 'Tierra', 'Tierra',
            'Agua', 'Agua', 'Aire', 'Agua',  'Tierra', 'Tierra', 
            'Agua', 'Aire', 'Agua', 'Aire', 'Tierra', 'Aire', 
            'Tierra', 'Tierra', 'Tierra', 'Tierra', 'Agua', 'Aire',
        ];

        for ($i = 0; $i < count($nombres); $i++) {

            DB::table('xuxemons')->insert([
                'nombre' => $nombres[$i],
                'tipo' => $tipo[$i],
                'archivo' => strtolower($nombres[$i]) . '.png',
            ]);
        }
    }
}
