<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Horario;
use Carbon\Carbon;

class ResetDailyClaims extends Command
{
    protected $signature = 'claims:reset';

    protected $description = 'Resetea las reclamaciones diarias de chuches';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Resetear las reclamaciones diarias
        Horario::query()->update(['last_claim_date' => null]);

        $this->info('Reclamaciones diarias reseteadas correctamente.');
    }
}
