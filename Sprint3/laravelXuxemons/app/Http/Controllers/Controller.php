<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

// Imports agregador //
use App\Models\User;
use \Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
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
}
