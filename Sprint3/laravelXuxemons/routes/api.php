<?php

use Illuminate\Support\Facades\Route;
// Controladores //
use \App\Http\Controllers\Controller;
use \App\Http\Controllers\XuxemonsController;
use \App\Http\Controllers\XuxemonsUserController;
use App\Http\Controllers\ChuchesUserController;
use App\Http\Controllers\ContactosController;
use App\Http\Controllers\IntercambioController;


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
Route::get('/usuario/{userToken}', [Controller::class, 'show']);
Route::put('/updateUsuario/{id}', [Controller::class, 'update']);
Route::post('/subirImagen', [Controller::class, 'uploadImage']);
// ---------------------- //
// ---------------------- //

// Rutas para el inventario / hospital // 
Route::get('/inventario', [Controller::class, 'inventario']);
Route::get('/hospital/{userToken}', [Controller::class, 'hospital']);
// ---------------------- //
// ---------------------- //

// Rutas Contactos //
// Crear peticion usuarios //
Route::post('/usuarios', [ContactosController::class, 'crear']);
// acceptar peticion usuarios //
Route::post('/acceptar', [ContactosController::class, 'acceptar']);
// Crear peticion usuarios //
Route::post('/denegar', [ContactosController::class, 'denegar']);
// Crear peticion usuarios //
Route::post('/guardarmensaje', [ContactosController::class, 'guardarMensaje']);
// Muestra solicitudes de amisatad del usuarios //
Route::get('/showSolicitudes/{userId}', [ContactosController::class, 'showSolicitudes']);
// Muestra los amigos del usuario //
Route::get('/show/{userId}', [ContactosController::class, 'showFriends']);
// Muestra el chat //
Route::get('/show/{userToken}/&/{idUser}', [ContactosController::class, 'showChat']);
// Obtiene el id del usuario para intercambiar cuando se selecciona en contactos //
Route::get('getId/{idUser}', [ContactosController::class, 'getId']);

// Rutas Intercambio //
// Mostrar los xuxemons del otro usuario //
Route::get('/xuxemonsOtherUser/{userId}', [IntercambioController::class, 'showXuxemonsUser']);
// Mostrar la informacion del otro usuario //
Route::get('/otherUsuario/{userToken}', [IntercambioController::class, 'showOtherUser']);
// muestra la informacion del intercambio
Route::get('/showTrade/{userToken}', [IntercambioController::class, 'mostrarIntercambio']);

//implementar las rutas en el servicio
// Mostrar todos los xuxemons del usuario //
Route::post('/trade', [IntercambioController::class, 'solicitudIntercambio']);
// Accepta y intercambia los xuxemons
Route::post('/acceptTrade', [IntercambioController::class, 'acceptarIntercambio']);
// obtiene la informacion de los xuxemosn a tradear
Route::get('/xuxemonsTrade1/{usertoken}/{idUser}', [IntercambioController::class, 'xuxemonsIntercambio1']);
Route::get('/xuxemonsTrade2/{usertoken}/{idUser}', [IntercambioController::class, 'xuxemonsIntercambio2']);