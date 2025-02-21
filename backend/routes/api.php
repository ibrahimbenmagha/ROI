<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LaboController;
use App\Http\Controllers\ActivitiesController;




Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('register', [AuthController::class, 'Create_Admin']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);
Route::post('CreateLabo', [LaboController::class, 'CreateLabo']);
Route::get('GetAllLabos', [LaboController::class, 'GetAllLabos']);
Route::get('GetAllLaboInfos', [LaboController::class, 'GetAllLaboInfos']);

Route::get('getAllActivity', action: [ActivitiesController::class, 'getAllActivity']);
Route::get('getActivityById/{id}', action: [ActivitiesController::class, 'getActivityById']);
Route::post('CreateActivityByLabo', action: [LaboController::class,'CreateActivityByLabo']);



