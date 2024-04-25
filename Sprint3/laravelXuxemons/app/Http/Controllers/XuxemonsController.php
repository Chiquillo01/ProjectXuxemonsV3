<?php

namespace App\Http\Controllers;

use App\Models\Xuxemons;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class XuxemonsController extends Controller
{
    /**
     * Nombre: crearXuxemon
     * Función: se encarga de crear los nuevos xuxemons, para ello valida los datos recibidos 
     * y crea el nuevo xuxemon a traves de una transacción
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function crearXuxemon(Request $request)
    {
        try {
            // Valida los datos pasados en el body del servicio //
            $validados = $request->validate([
                'nombre' => 'required|string',
                'tipo' => 'required|string',
                'archivo' => 'required|string',
            ]);

            DB::transaction(function () use ($validados) {
                Xuxemons::create($validados);
            });

            return response()->json(['message' => 'Xuxemon creado con exito'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al crear el Xuxemon: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Nombre: show
     * Función: Recoje todos los xuxemons de la db y se los pasa al 
     * servicio de angular que lo llama
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Xuxemons $xuxemons)
    {
        try {
            $xuxemons = Xuxemons::all();

            return response()->json([$xuxemons, 200]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al retornar los xuxemons: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Nombre: update
     * Función: se encarga de actualizar los nuevos valores, para ello recoje los datos
     * valida los datos recibidos 
     * y crea el update de losdatos xuxemon a traves de una transacción. Sabe el xuxemon a actualizar 
     * gracias al paremetro extra que le llega por la api
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        try {
            $id_Xuxemon = $request->input('id_Xuxemon');
            $xuxemonNewDate = $request->input('xuxemonNewDate');

            // Valida los datos
            $validados = $request->validate([
                'xuxemonNewDate.nombre' => ['required', 'max:20', 'unique:xuxemons,nombre,' . $id_Xuxemon],
                'xuxemonNewDate.tipo' => ['required', 'in:Tierra,Aire,Agua'],
                'xuxemonNewDate.archivo' => ['required', 'unique:xuxemons,archivo,' . $id_Xuxemon],
            ]);

            // Hace el update dentro de una transaccion
            DB::transaction(function () use ($validados, $id_Xuxemon) {
                // Busca el Xuxemon por su ID
                $xuxemon = Xuxemons::findOrFail($id_Xuxemon);

                // Actualiza el Xuxemon con los datos validados
                $xuxemon->update([
                    'nombre' => $validados['xuxemonNewDate']['nombre'],
                    'tipo' => $validados['xuxemonNewDate']['tipo'],
                    'archivo' => $validados['xuxemonNewDate']['archivo'],
                ]);
            });

            // Retorna actualizado de forma satisfactoria
            return response()->json(['message' => 'Se ha actualizado de forma correcta'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ha ocurrido un error al actualizar los xuxemons: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Nombre: destroy
     * Función: elimina al xuxemon que le llega como parametro
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Xuxemons $xuxemons)
    {
        try {

            DB::transaction(function () use ($xuxemons) {
                $xuxemons->delete();
            });

            // Retorna borrado de forma correcta
            return response()->json(['message' => 'Se ha borrado de forma correcta'], 200);
        } catch (\Exception $e) {

            // Retorna error
            return response()->json(['message' => 'Ha ocurrido un error al eliminar: ' . $e->getMessage()], 500);
        }
    }

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
