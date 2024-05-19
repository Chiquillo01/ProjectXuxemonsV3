<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\XuxemonsUser;
use App\Models\User;
use App\Models\Intercambio;
use Illuminate\Support\Facades\DB;

class IntercambioController extends Controller
{
    public function showXuxemonsUser($idUser)
    {
        try {
            // Realizar la consulta con un join para obtener los Xuxemons asociados al usuario
            $xuxemons = XuxemonsUser::where('user_id', $idUser)
                ->join('xuxemons', 'xuxemons_users.xuxemon_id', '=', 'xuxemons.id')
                ->where('xuxemons_users.activo', 0)
                ->select(
                    'xuxemons_users.*',
                    'xuxemons.nombre',
                    'xuxemons.tipo',
                    'xuxemons.archivo',
                    'xuxemons.tamano',
                    'xuxemons.evo1',
                    'xuxemons.evo2'
                )
                ->orderBy('xuxemons_users.favorito', 'desc')
                ->get();

            // Retorna todos los xuxemons en forma json
            return response()->json([$xuxemons, $idUser, 200]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar los xuxemons: ' . $e->getMessage()], 500);
        }
    }

    public function showOtherUser($idUser)
    {
        try {
            // Obtener el usuario a partir del token proporcionado
            $user = User::where('idUser', $idUser)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            return response()->json($user, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function solicitudIntercambio(Request $request)
    {
        try {

            // Obtener el token de usuario de la solicitud
            $userToken = $request->input('token');
            // Obtener el token de usuario de la solicitud
            $tagUser2 = $request->input('iduser2');
            // Obtener el token de usuario de la solicitud
            $idXuxemon1 = $request->input('xuxemon1');
            // Obtener el token de usuario de la solicitud
            $idXuxemon2 = $request->input('xuxemon2');

            // Busca el id del usuario autorizado
            $user = User::where('remember_token', $userToken)
                ->first();
            // Si no exixte usuario retornara el error
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado', $user], 404);
            }

            // Busca el id del usuario autorizado
            $user2 = User::where('idUser', $tagUser2)
                ->first();
            // Si no exixte usuario retornara el error
            if (!$user2) {
                return response()->json(['message' => 'Usuario no encontrado', $user], 404);
            }

            $idUser1 = $user->id;
            $idUser2 = $user2->id;

            $Trade = new Intercambio();
            $Trade->user1 = $idUser1;
            $Trade->xuxemon1 = $idXuxemon1;
            $Trade->user2 = $idUser2;
            $Trade->xuxemon2 = $idXuxemon2;
            $Trade->intercambiar = false;
            $Trade->save();

            return response()->json($Trade, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function mostrarIntercambio($userToken)
    {
        try {

            // Busca el id del usuario autorizado
            $user = User::where('remember_token', $userToken)
                ->first();
            // Si no exixte usuario retornara el error
            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado', $user], 404);
            }

            $idUser = $user->id;

            $Trade = Intercambio::Where('user2', $idUser)
                ->first();

            return response()->json($Trade, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function acceptarIntercambio(Request $request)
    {
        try {
            // Obtener los parámetros de la solicitud
            $userToken = $request->input('token');
            $tagUser2 = $request->input('iduser2');
            $idXuxemon1 = $request->input('xuxemon1');
            $idXuxemon2 = $request->input('xuxemon2');

            // Busca el id del usuario autorizado
            $user = User::where('remember_token', $userToken)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Busca el id del usuario autorizado
            $user2 = User::where('idUser', $tagUser2)
                ->first();
            // Si no exixte usuario retornara el error
            if (!$user2) {
                return response()->json(['message' => 'Usuario no encontrado', $user], 404);
            }

            $idUser2 = $user->id;
            $idUser = $user2->id;

            $Trade = Intercambio::where('user2', $idUser2)
                ->where('user1', $idUser)
                ->where('xuxemon1', $idXuxemon1)
                ->where('xuxemon2', $idXuxemon2)
                ->first();

            if (!$Trade) {
                return response()->json(['message' => 'Intercambio no encontrado'], 404);
            }

            $Trade->intercambiar = true;
            $Trade->save();

            $tradeUser2 = XuxemonsUser::where('user_id', $idUser2)->where('xuxemon_id', $idXuxemon2)->first();
            $tradeUser1 = XuxemonsUser::where('user_id', $idUser)->where('xuxemon_id', $idXuxemon1)->first();

            // Verifica que se hayan encontrado los registros de XuxemonsUser
            if (!$tradeUser1 || !$tradeUser2) {
                return response()->json(['message' => 'Xuxemon no encontrado para uno de los usuarios'], 404);
            }

            // Realiza la transacción para intercambiar los Xuxemons
            DB::transaction(function () use ($tradeUser2, $idUser, $tradeUser1, $idUser2) {
                $tradeUser2->user_id = $idUser;
                $tradeUser2->save();

                $tradeUser1->user_id = $idUser2;
                $tradeUser1->save();
            });

            return response()->json([
                'trade' => $Trade,
                'trade1' => $tradeUser1,
                'trade2' => $tradeUser2,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function xuxemonsIntercambio1($userToken, $tagUser)
    {
        try {
            // $userToken = $request->input('token');
            // $idUser = $request->input('iduser2');

            $user = User::where('remember_token', $userToken)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Busca el id del usuario autorizado
            $user2 = User::where('idUser', $tagUser)
                ->first();
            // Si no exixte usuario retornara el error
            if (!$user2) {
                return response()->json(['message' => 'Usuario no encontrado', $user2], 404);
            }
            $idUser2 = $user->id;
            $idUser1 = $user2->id;
            $infoTrade = Intercambio::where('user2', $idUser2)->where('user1', $idUser1)->first();

            if (!$infoTrade) {
                return response()->json(['message' => 'Info trade no encontrado'], 404);
            }

            $idXuxemon1 = $infoTrade->xuxemon1;

            $tradeUser1 = XuxemonsUser::where('user_id', $idUser1)->where('xuxemon_id', $idXuxemon1)
                ->join('xuxemons', 'xuxemons_users.xuxemon_id', '=', 'xuxemons.id')
                ->select(
                    'xuxemons_users.*',
                    'xuxemons.nombre',
                    'xuxemons.tipo',
                    'xuxemons.archivo',
                    'xuxemons.tamano',
                    'xuxemons.evo1',
                    'xuxemons.evo2'
                )->first();

            if (!$tradeUser1) {
                return response()->json(['message' => 'Xuxemon no encontrado para uno de los usuarios'], 404);
            }

            return response()->json($tradeUser1, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }

    public function xuxemonsIntercambio2($userToken, $tagUser)
    {
        try {
            // $userToken = $request->input('token');
            // $idUser = $request->input('iduser2');

            $user = User::where('remember_token', $userToken)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // Busca el id del usuario autorizado
            $user2 = User::where('idUser', $tagUser)
                ->first();
            // Si no exixte usuario retornara el error
            if (!$user2) {
                return response()->json(['message' => 'Usuario no encontrado', $user2], 404);
            }
            $idUser2 = $user->id;
            $idUser1 = $user2->id;
            $infoTrade = Intercambio::where('user2', $idUser1)->where('user1', $idUser2)->first();

            if (!$infoTrade) {
                return response()->json(['message' => 'Info trade no encontrado'], 404);
            }

            $idXuxemon2 = $infoTrade->xuxemon2;

            $tradeUser1 = XuxemonsUser::where('user_id', $idUser2)->where('xuxemon_id', $idXuxemon2)
                ->join('xuxemons', 'xuxemons_users.xuxemon_id', '=', 'xuxemons.id')
                ->select(
                    'xuxemons_users.*',
                    'xuxemons.nombre',
                    'xuxemons.tipo',
                    'xuxemons.archivo',
                    'xuxemons.tamano',
                    'xuxemons.evo1',
                    'xuxemons.evo2'
                )->first();

            if (!$tradeUser1) {
                return response()->json(['message' => 'Xuxemon no encontrado para uno de los usuarios'], 404);
            }

            return response()->json($tradeUser1, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar las solicitudes: ' . $e->getMessage()], 500);
        }
    }
}
