<?php

namespace App\Http\Controllers;

// Imports necesarios //
use Carbon\Carbon;
use App\Models\ChuchesUser;
use App\Models\Chuches;
use App\Models\User;
use App\Models\Horario;
use App\Models\Curas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChuchesUserController extends Controller
{
    /**
     * Nombre: show
     * Función: Enviar los datos para que se muestren en el frontend
     */
    public function show(Request $request)
    {
        try {
            $userId = $request->input('userToken');
            $user = User::where('remember_token', $userId)
                ->first();

            if (!$user) {
                // Manejar el caso donde no se encontró ningún usuario con el token proporcionado
                return response()->json(['message' => 'Usuario no encontrado', $user], 404);
            }


            // Realizar la consulta con un join para obtener los Xuxemons asociados al usuario
            $chuches = ChuchesUser::where('user_id', $user->id)
                ->join('chuches', 'chuches_users.chuche_id', '=', 'chuches.id')
                ->select('chuches_users.*', 'chuches.nombre', 'chuches.dinero', 'chuches.modificador', 'chuches.archivo')
                ->get();

            // Retorna todos los xuxemons en forma json
            return response()->json([$chuches, 200]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las chuches: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Nombre: obtenerChucheAleatoria
     * Función: Obtener una chuche aleatoria de la tabla chuches.
     * @return \App\Models\Xuxemons|null
     */
    public static function obtenerChucheAleatoria()
    {
        $chucheAleatoria = Chuches::inRandomOrder()->first();
        return $chucheAleatoria ? $chucheAleatoria->id : null;
    }

    /**
     * Nombre: debug
     * Función: Crear una nueva chuche aleatoria asociada al usuario en sesión.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function debug(Request $request, )
    {
        try {
            // $userId = $request->input('userToken');
            // $user = User::where('remember_token', $userId)
            //     ->first();

            // $chucheAleatoria = self::obtenerChucheAleatoria();

            // if ($chucheAleatoria) {
            //     // Crear un nuevo xuxemon asociado al usuario en sesión
            //     $nuevaChucheUsuario = new ChuchesUser();
            //     $nuevaChucheUsuario->chuche_id = $chucheAleatoria;
            //     $nuevaChucheUsuario->user_id = $user;
            //     $nuevaChucheUsuario->save();

            //     // Retornar la respuesta con éxito
            //     return response()->json(['message' => 'Nuevo Xuxemon creado con éxito'], 200);
            // } else {
            //     // Retornar un error si no se encontró un xuxemon aleatorio
                return response()->json([$request], 404);
            // }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al crear la chuche aleatorio: ' . $e->getMessage()], 500);
        }

    }
}