<?php

namespace App\Http\Controllers;

// Imports //
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Chuches;
use App\Models\ChuchesUser;
use App\Models\Horario;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ChuchesUserController extends Controller
{
    /**
     * Nombre: obtenerXuxemonAleatorio
     * Función: Obtener una chuche aleatoria de la tabla chuches.
     * @return \App\Models\Xuxemons|null
     */
    public static function obtenerChucheAleatoria()
    {
        return DB::table('chuches')->inRandomOrder()->first()->id;
    }

    /**
     * Nombre: debug
     * Función: Crear una nueva chuche aleatoria asociada al usuario en sesión.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function reclamarDiarias(Request $request)
    {
        try {
            $userToken = $request->input('token');

            $user = User::where('remember_token', $userToken)
                ->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado.'], 404);
            }

            $userId = $user->id;
            $today = Carbon::today()->toDateString();

            // Verificar si el usuario ya reclamó sus chuches hoy
            $horario = Horario::where('id_users', $userId)->first();

            if ($horario && $horario->last_claim_date == $today) {
                return response()->json(['message' => 'Ya has reclamado tus chuches marrano.'], 403);
            }

            // Registrar la reclamación diaria
            if ($horario) {
                $horario->last_claim_date = $today;
                $horario->save();
            } else {
                Horario::create([
                    'id_users' => $userId,
                    'chuche_maximas' => 10,
                    'debug' => true,
                    'date_debug' => now(),
                    'last_claim_date' => $today,
                ]);
            }

            // Obtener el número máximo de chuches a crear desde la tabla horario
            $numeroChuches = $horario ? $horario->chuche_maximas : 10;
            $chuchesCreadas = [];

            for ($i = 0; $i < $numeroChuches; $i++) {
                $chucheAleatoria = $this->obtenerChucheAleatoria();

                if (!$chucheAleatoria) {
                    return response()->json(['message' => 'No se pudo encontrar una chuche aleatoria.'], 404);
                }

                $chucheExistente = ChuchesUser::where('user_id', $userId)
                    ->where('chuche_id', $chucheAleatoria)
                    ->first();

                if ($chucheExistente) {
                    $chucheExistente->stack += 1;
                    $chucheExistente->save();
                } else {
                    $nuevaChucheUsuario = new ChuchesUser();
                    $nuevaChucheUsuario->chuche_id = $chucheAleatoria;
                    $nuevaChucheUsuario->user_id = $userId;
                    $nuevaChucheUsuario->stack = 1;
                    $nuevaChucheUsuario->save();
                }

                $chuchesCreadas[] = $chucheAleatoria;
            }

            return response()->json(['message' => 'Chuches añadidas con éxito', 'chuches' => $chuchesCreadas], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al crear la chuche aleatoria: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Nombre: show
     * Función: Enviar los datos para que se muestren en el frontend
     */
    public function showChuches($userToken)
    {
        try {

            $user = User::where('remember_token', $userToken)
                ->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado.'], 404);
            }

            $userId = $user->id;

            // Realizar la consulta con un join para obtener los Xuxemons asociados al usuario
            $chuches = ChuchesUser::where('user_id', $userId)
                ->join('chuches', 'chuches_users.chuche_id', '=', 'chuches.id')
                ->select('chuches_users.*', 'chuches.nombre', 'chuches.dinero', 'chuches.modificador', 'chuches.archivo')
                ->get();

            // Retorna todos los xuxemons en forma json
            return response()->json([$chuches, 200]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las chuches: ' . $e->getMessage()], 500);
        }
    }

    function updateStack(Request $request, ChuchesUser $chuches)
    {
        try {
            // Valida los datos recibidos
            $validados = $request->validate([
                'stack' => 'required', // Validación simple, puedes ajustarla según tus necesidades
            ]);

            // Hace el update dentro de una transacción
            DB::transaction(function () use ($validados, $chuches) {
                $chuches->update($validados);
            });

            // Retorna actualizado de forma satisfactoria
            return response()->json(['message' => 'Se ha actualizado de forma correcta'], 200);
        } catch (\Exception $e) {

            // Retorna error
            return response()->json(['message' => 'Ha ocurrido un error al actualizar las chuches: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Nombre: updateChuchesMax
     * Función: gracias al valor que se le pasa por paremetro hace un update
     * a la bd con el nuevo valor, esto lo hace a todos los registros
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateChuchesMax(Request $request)
    {
        try {
            $chuches = $request->input('newChuchesMax.chuches');

            DB::transaction(function () use ($chuches) {
                Horario::query()->update(['chuche_maximas' => $chuches]);
            });

            return response()->json(['message' => 'Se ha actualizado el valor máximo de chuches al dia'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al actualizar las chuches máximas: ' . $e->getMessage()], 500);
        }
    }

}

