<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

// Imports agregador //
use App\Models\User;
use App\Models\Curas;
use App\Models\XuxemonsUser;
use \Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Mockery\Exception;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Nombre: register
     * Función: Primeramente empieza con una transacción, luego valida los datos introducidos 
     * en el body, retoca el rol para poder introducir de forma corecta el valor y finalmente
     * crea al usuario y lo introduce en la db
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // Inicia la transaccion //
        DB::beginTransaction();

        try {
            // Valida que los datos tengan el formato adequado //
            $validados = $request->validate([
                'nick' => ['required', 'min:2', 'max:20'],
                'email' => ['required', 'max:50'],
                'password' => ['required', 'min:8', 'max:20', 'confirmed'],
                'rol' => ['required'],
            ]);

            // Codificar el valor del rol y id para que corresponda con el caracter que espera en la db //
            $id_User = Str::random(6);
            $rolStatus = $request->input('rol') ? true : false;


            // Crea el usuario //
            $user = new User();
            $user->idUser = $id_User;
            $user->nick = $request->input('nick');
            $user->email = $request->input('email');
            $user->password = Hash::make($request->input('password'));
            $user->rol = $rolStatus;
            $user->save();

            // Guarda la información en la bd //
            DB::commit();

            return response()->json(['message' => 'Usuario registrado correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Ha ocurrido un error al registrar el usuario: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Nombre: login
     * Función: Valida los datos del body e intenta hacer el inicio de sesión
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            // Valida los datos //
            $validados = $request->validate([
                'email' => ['required'],
                'password' => ['required'],
            ]);

            // Hace el intento de iniciar sesión //
            if (Auth::attempt($validados)) {

                // Si las credenciales son correctas //
                $user = Auth::user();
                $token = $user->createToken('authToken')->plainTextToken;
                $rol = Auth::user()->rol;

                $user->remember_token = $token;
                $user->save();

                // Deuvelve el token de acceso y el tipo de token //
                return response()->json([
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'rol' => $rol,
                ], 200);
            } else {
                return response()->json(['message' => 'Credenciales incorrectas'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al hacer login: ' . $e->getMessage()], 500);
        }
    }

    public function showUser($userToken)
    {
        try {
            // Obtener el usuario a partir del token proporcionado
            $user = User::where('remember_token', $userToken)->get();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            return response()->json($user, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Nombre: inventario
     * Función: recoje todos los valores que hay en la bd de curas
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function inventario(Request $request)
    {
        try {
            $curas = Curas::all();

            return response()->json([$curas, 200]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las curas disponibles: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Nombre: hospital
     * Función: a partir del usuario enviado recoje todos sus xuxemon que esten enfermos
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function hospital($userToken)
    {
        try {
            $user = User::where('remember_token', $userToken)->first();
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            $xuxemonsEnfermos = DB::table('xuxemons_users')
                ->where('xuxemons_users.user_id', $user->id)
                ->where('xuxemons_users.enfermo', true)
                ->join('xuxemons', 'xuxemons_users.xuxemon_id', '=', 'xuxemons.id')
                ->join('xuxemons_users_enfermedades', 'xuxemons_users.id', '=', 'xuxemons_users_enfermedades.xuxemon_user_id')
                ->join('enfermedades', 'xuxemons_users_enfermedades.enfermedad_id', '=', 'enfermedades.id')
                ->select(
                    'xuxemons_users.*',
                    'xuxemons.nombre',
                    'xuxemons.tipo',
                    'xuxemons.archivo',
                    'enfermedades.nombre as enfermedad_nombre'
                )
                ->get();


            if ($xuxemonsEnfermos->isEmpty()) {
                return response()->json(['message' => 'No hay Xuxemons enfermos'], 200);
            }

            return response()->json(['xuxemonsEnfermos' => $xuxemonsEnfermos], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al obtener los Xuxemons enfermos: ' . $e->getMessage()], 500);
        }
    }


    // Método para actualizar un usuario
    // public function update(Request $request, $id)
    // {
    //     DB::beginTransaction();

    //     try {
    //         $user = User::find($id);

    //         if (!$user) {
    //             return response()->json(['message' => 'Usuario no encontrado'], 404);
    //         }

    //         $validatedData = $request->validate([
    //             'nick' => ['required', 'min:2', 'max:20'],
    //             'email' => ['required', 'email', 'max:50'],
    //             'password' => ['nullable', 'min:8', 'max:20', 'confirmed'],
    //             'imagen' => ['nullable', 'string'],
    //         ]);

    //         $user->nick = $validatedData['nick'];
    //         $user->email = $validatedData['email'];

    //         if (!empty($validatedData['password'])) {
    //             $user->password = Hash::make($validatedData['password']);
    //         }

    //         if (!empty($validatedData['imagen'])) {
    //             $user->imagen = $validatedData['imagen'];
    //         }

    //         $user->save();
    //         DB::commit();

    //         return response()->json(['message' => 'Usuario actualizado correctamente'], 200);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json(['message' => 'Ha ocurrido un error al actualizar el usuario: ' . $e->getMessage()], 500);
    //     }
    // }

    // // Método para subir una imagen
    // public function uploadImage(Request $request)
    // {
    //     $request->validate([
    //         'token' => 'required|string',
    //         'imagen' => 'required|string',
    //     ]);

    //     $user = User::where('remember_token', $request->input('token'))->first();

    //     if (!$user) {
    //         return response()->json(['message' => 'Usuario no encontrado'], 404);
    //     }

    //     $image = $request->input('imagen');
    //     $imageName = $user->idUser . '_profile_image.png';
    //     $imagePath = 'profile_images/' . $imageName;

    //     // Decodificar la imagen y guardarla
    //     Storage::disk('public')->put($imagePath, base64_decode($image));

    //     $user->imagen = Storage::url($imagePath);
    //     $user->save();

    //     return response()->json(['message' => 'Imagen subida correctamente', 'image_url' => $user->imagen], 200);
    // }
}
