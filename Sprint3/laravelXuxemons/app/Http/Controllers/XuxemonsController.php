<?php

namespace App\Http\Controllers;

use App\Models\Xuxemons;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class XuxemonsController extends Controller
{
    /**
     * Nombre: updateTam
     * Función: gracias al valor que se le pasa por paremetro hace un update
     * a la bd con el nuevo valor, esto lo hace a todos los registros
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateTam(Request $request)
    {
        try {
            $tamano = $request->input('newTamano.tamano');

            DB::transaction(function () use ($tamano) {
                Xuxemons::query()->update(['tamano' => $tamano]);
            });

            return response()->json(['message' => 'Se ha actualizado el tamaño de los xuxemons correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al actualizar los xuxemons: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Nombre: updateEvo1
     * Función: gracias al valor que se le pasa por paremetro hace un update
     * a la bd con el nuevo valor, esto lo hace a todos los registros
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateEvo1(Request $request)
    {
        try {
            $evolucion = $request->input('evolucion.evo1');

            DB::transaction(function () use ($evolucion) {
                Xuxemons::query()->update(['evo1' => $evolucion]);
            });

            return response()->json([$evolucion], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al actualizar los xuxemons: ' . $e->getMessage()], 500);
        }
    }
    /**
     * Nombre: updateEvo2
     * Función: gracias al valor que se le pasa por paremetro hace un update
     * a la bd con el nuevo valor, esto lo hace a todos los registros
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateEvo2(Request $request)
    {
        try {
            $evolucion = $request->input('evolucion.evo2');

            DB::transaction(function () use ($evolucion) {
                Xuxemons::query()->update(['evo2' => $evolucion]);
            });

            return response()->json([$evolucion], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al actualizar los xuxemons: ' . $e->getMessage()], 500);
        }
    }
}
