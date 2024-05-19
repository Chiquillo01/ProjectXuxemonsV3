<?php

use Illuminate\Support\Facades\Route;
// Controladores //
use \App\Http\Controllers\Controller;
use \App\Http\Controllers\XuxemonsController;
use \App\Http\Controllers\XuxemonsUserController;
use App\Http\Controllers\ChuchesUserController;


// Rutas para los Xuxemons //
// Creación de Xuxemons //
Route::post('/xuxemons', [XuxemonsController::class, 'crearXuxemon']);
Route::post('/xuxemons/pc/random', [XuxemonsUserController::class, 'debug']);
// Mostrar todos los xuxemons , xuxemons del usuario y sus favoritos //
Route::get('/xuxemons', [XuxemonsController::class, 'show']);
Route::get('/xuxemonsUser/{userToken}', [XuxemonsUserController::class, 'show']);
Route::get('/xuxemonsUserActivos/{userId}', [XuxemonsUserController::class, 'showActivos']);
// Actualización de Xuxemon //
Route::put('/xuxemons/actualizar', [XuxemonsController::class, 'update']);
Route::post('/xuxemons/activo', [XuxemonsUserController::class, 'updateActivo']);
Route::post('/xuxemons/favorito', [XuxemonsUserController::class, 'updateFav']);
// Evolucionar al Xuxemon correspondiente //
Route::put('/xuxemons/evolucionar', [XuxemonsUserController::class, 'evolucionarXuxemon']);
Route::put('/xuxemons/evolucionar2', [XuxemonsUserController::class, 'evolucionarXuxemon2']);
// Eliminar un xuxemon //
Route::delete('/xuxemons/{xuxemons}', [XuxemonsController::class, 'destroy']);
// Actualizar configuraciones del administrador //
Route::put('/xuxemons/tamano', [XuxemonsController::class, 'updateTam']);
Route::put('/xuxemons/evos', [XuxemonsController::class, 'updateEvo1']);
Route::put('/xuxemons/evos2', [XuxemonsController::class, 'updateEvo2']);
Route::put('/chuches/maximas', [ChuchesUserController::class, 'updateChuchesMax']);
// Actualizar alimentos xuxemon usuario //
Route::put('/xuxemons/alimentar/user', [XuxemonsUserController::class, 'alimentar']);
// ---------------------- //
// ---------------------- //

// Rutas para las chuches //
// Crear chuches aleatorias //
Route::post('/chuches/random', [ChuchesUserController::class, 'reclamarDiarias']);
// Mostrar todas las xuxes del usuario //
Route::get('/chuchesUser/{userId}', [ChuchesUserController::class, 'show']);
// ---------------------- //
// ---------------------- //

// Rutas del usuario Usuario // 
Route::post('/register', [Controller::class, 'register']);
Route::post('/login', [Controller::class, 'login']);
// ---------------------- //
// ---------------------- //

// Rutas para el inventario / hospital // 
Route::get('/inventario', [Controller::class, 'inventario']);
Route::get('/hospital/{userToken}', [Controller::class, 'hospital']);
// ---------------------- //
// ---------------------- //