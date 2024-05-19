<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    use HasFactory;
    protected $table = 'horario';
    protected $fillable = [
        'chuche_maximas',
        'debug',
        'id_users',
        'date_debug',
        'last_claim_date'
    ];
}
