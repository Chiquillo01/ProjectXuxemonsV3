<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\PendingHasThroughRelationship;
use Illuminate\Http\Request;
use App\Models\User;
use App\Events\Message;
use App\Models\Contactos;
use Illuminate\Support\Facades\Log;

class ContactosController extends Controller
{
    /*
        Tipos de estado contactos:
        0 = nada
        1 = solicitud enviada
        2 = Solicitud acceptada
        3 = Solicitud rechazada
    */
    public function crear(Request $request)
    {
        try {

            // Obtener el token de usuario de la solicitud
            $userToken = $request->input('token');
            // Obtener el token de usuario de la solicitud
            $searchUser = $request->input('searchUser');

            // Busca el id del usuario autorizado
            $user = User::where('remember_token', $userToken)
                ->first();

            // Si no exixte usuario retornara el error
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado', $user], 404);
            }

            if ($user->idUser == $searchUser) {
                return response()->json(['message' => 'Es el mismo usuario', $user], 404);
            }

            // Busca el id del usuario autorizado
            $buscarUser = User::where('idUser', $searchUser)
                ->first();

            // Si no exixte usuario retornara el error
            if (!$buscarUser) {
                return response()->json(['message' => 'Usuario no encontrado', $user], 404);
            }

            // Cambia esto
            $contactosExist = Contactos::all();

            // A algo como esto
            $contactosExist = Contactos::where(function ($query) use ($user, $buscarUser) {
                $query->where('user1', $user->idUser)->where('user2', $buscarUser->idUser)
                    ->orWhere('user1', $buscarUser->idUser)->where('user2', $user->idUser);
            })->first();

            // Y luego comprueba si el contacto existe
            if ($contactosExist) {
                if ($contactosExist->estado == 3) {
                    $contactosExist->estado = 1;
                    $contactosExist->save();
                }
                // El contacto ya existe
                return response()->json(['message' => 'Usuario ya existente encontrado', $contactosExist], 200);
            } else {
                if ($user->idUser !== $buscarUser->idUser) {
                    // El contacto no existe, así que crea uno nuevo
                    $nuevoContacto = new Contactos();
                    $nuevoContacto->user1 = $user->idUser;
                    $nuevoContacto->user2 = $buscarUser->idUser;
                    $nuevoContacto->mensajes = "";
                    $nuevoContacto->estado = 1;
                    $nuevoContacto->save();
                }
            }
            return response()->json($nuevoContacto, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al crear las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function showFriends($userToken)
    {
        try {
            // Obtener el usuario a partir del token proporcionado
            $user = User::where('remember_token', $userToken)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Realizar la consulta para obtener las solicitudes asociadas al usuario
            $solicitudes = Contactos::where(function ($query) use ($user) {
                $query->where('user1', $user->idUser)
                    ->orWhere('user2', $user->idUser);
            })
                ->join('users', function ($join) {
                    $join->on('contactos.user1', '=', 'users.idUser')
                        ->orOn('contactos.user2', '=', 'users.idUser');
                })
                ->whereNotIn('users.idUser', [$user->idUser])
                ->select(
                    'contactos.*',
                    'users.idUser',
                    'users.nick',
                    'users.imagen',
                )
                ->get();


            return response()->json($solicitudes, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function showSolicitudes($userToken)
    {
        try {
            // Obtener el usuario a partir del token proporcionado
            $user = User::where('remember_token', $userToken)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Realizar la consulta para obtener las solicitudes asociadas al usuario
            $solicitudes = Contactos::whereNot('user1', $user->idUser)
                ->where('user2', $user->idUser)
                ->join('users', function ($join) {
                    $join->on('contactos.user1', '=', 'users.idUser')
                        ->orOn('contactos.user2', '=', 'users.idUser');
                })
                ->whereNotIn('users.idUser', [$user->idUser])
                ->select(
                    'contactos.*',
                    'users.idUser',
                    'users.nick',
                    'users.imagen'
                )
                ->get();


            return response()->json($solicitudes, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function showChat($userToken, $idUser2)
    {
        try {
            // Obtener el usuario a partir del token proporcionado
            $user = User::where('remember_token', $userToken)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Realizar la consulta para obtener las solicitudes asociadas al usuario
            $solicitudes = Contactos::where(function ($query) use ($user, $idUser2) {
                $query->where('user1', $user->idUser)->where('user2', $idUser2)
                    ->orWhere('user1', $idUser2)->where('user2', $user->idUser);
            })
                ->join('users', function ($join) {
                    $join->on('contactos.user1', '=', 'users.idUser')
                        ->orOn('contactos.user2', '=', 'users.idUser');
                })
                ->whereNotIn('users.idUser', [$user->idUser])
                ->select(
                    'contactos.*',
                    'users.idUser',
                    'users.nick',
                    'users.imagen',
                )
                ->get();


            return response()->json($solicitudes, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function acceptar(Request $request)
    {
        try {

            // Obtener el token de usuario de la solicitud
            $userToken = $request->input('token');
            // Obtener el token de usuario de la solicitud
            $searchUser = $request->input('searchUser');

            // Obtener el usuario a partir del token proporcionado
            $user = User::where('remember_token', $userToken)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            if ($user->idUser == $searchUser) {
                return response()->json(['message' => 'Es el mismos usuario'], 404);
            }

            $actualizar = Contactos::where(function ($query) use ($user) {
                $query->where('user1', $user->idUser)
                    ->orWhere('user2', $user->idUser);
            })
                ->where(function ($query) use ($searchUser) {
                    $query->where('user1', $searchUser)
                        ->orWhere('user2', $searchUser);
                })
                ->first();

            $actualizar->estado = 2;
            $actualizar->save();

            return response()->json(['message' => 'Se ha acceptado la solucitud' . $actualizar], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function denegar(Request $request)
    {
        try {

            // Obtener el token de usuario de la solicitud
            $userToken = $request->input('token');
            // Obtener el token de usuario de la solicitud
            $searchUser = $request->input('searchUser');

            // Obtener el usuario a partir del token proporcionado
            $user = User::where('remember_token', $userToken)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            if ($user->idUser == $searchUser) {
                return response()->json(['message' => 'Es el mismos usuario'], 404);
            }

            $actualizar = Contactos::where(function ($query) use ($user) {
                $query->where('user1', $user->idUser)
                    ->orWhere('user2', $user->idUser);
            })
                ->where(function ($query) use ($searchUser) {
                    $query->where('user1', $searchUser)
                        ->orWhere('user2', $searchUser);
                })
                ->first();

            $actualizar->estado = 3;
            $actualizar->save();
            return response()->json(['message' => 'Se ha denegado la solucitud' . $actualizar], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function guardarMensaje(Request $request)
    {
        // Obtener el token de usuario de la solicitud
        $usertoken = $request->input('token');
        // Obtener el ID del usuario receptor de la solicitud
        $user2 = $request->input('searchUser');
        // Obtener el mensaje de la solicitud
        $mensaje = $request->input('text');

        // Obtener el usuario a partir del token proporcionado
        $user = User::where('remember_token', $usertoken)->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        $user1 = $user->idUser;

        // Buscar si existe un contacto entre los dos usuarios
        $contacto = Contactos::where(function ($query) use ($user1, $user2) {
            $query->where('user1', $user1)->where('user2', $user2);
        })->orWhere(function ($query) use ($user1, $user2) {
            $query->where('user1', $user2)->where('user2', $user1);
        })->first();

        // Agregar el mensaje al registro del contacto
        $mensajes = json_decode($contacto->mensajes, true);
        $mensajes[] = [
            'user_id' => $user1, // El usuario que envió el mensaje
            'mensaje' => $mensaje,
            'created_at' => now()->toDateTimeString(),
            'nick' => $user->nick, // Obtener el nick del usuario
            'imagen' => $user->imagen, // Obtener la imagen del usuario
        ];
        $contacto->mensajes = json_encode($mensajes);
        $contacto->save();

        // Emitir el evento con el nuevo mensaje
        event(new Message($user1));

        return response()->json(['message' => 'Mensaje guardado correctamente'], 200);
    }
}
