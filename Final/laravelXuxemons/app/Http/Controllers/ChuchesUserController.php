<?php

namespace App\Http\Controllers;

// Imports //
use App\Models\ChuchesUser;
use App\Models\Chuches;
use App\Models\User;
use Illuminate\Http\Request;
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
        $chucheAleatoria = Chuches::inRandomOrder()->first();
        return $chucheAleatoria ? $chucheAleatoria->id : null;
    }

    /**
     * Nombre: debug
     * Función: Crear una nueva chuche aleatoria asociada al usuario en sesión.
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function debug(Request $request)
    {
        try {
            $chuchesCreadas = [];
            $userToken = $request->input('token');

            $user = User::where('remember_token', $userToken)
                ->pluck('id')
                ->first();

            $userId = $user;

            // Obtener el número máximo de chuches a crear
            $numeroChuches = 10;

            for ($i = 0; $i < $numeroChuches; $i++) {
                // Obtener una chuche aleatoria
                $chucheAleatoria = self::obtenerChucheAleatoria();

                if (!$chucheAleatoria) {
                    return response()->json(['message' => 'No se pudo encontrar una chuche aleatoria.'], 404);
                }

                // Verificar si el usuario ya tiene esta chuche
                $chucheExistente = ChuchesUser::where('user_id', $userId)
                    ->where('chuche_id', $chucheAleatoria)
                    ->first();

                if ($chucheExistente) {
                    // Incrementar el valor de stack en 1
                    $chucheExistente->stack += 1;
                    $chucheExistente->save();
                } else {
                    // Crear un nuevo ChuchesUser
                    $nuevaChucheUsuario = new ChuchesUser();
                    $nuevaChucheUsuario->chuche_id = $chucheAleatoria;
                    $nuevaChucheUsuario->user_id = $userId;
                    $nuevaChucheUsuario->stack = 1;
                    $nuevaChucheUsuario->save();
                }

                // Agregar la chuche creada al array
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
    public function show(Request $request, $userId)
    {
        try {
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

}

