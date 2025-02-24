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

//LaboController
Route::post('CreateLabo', [LaboController::class, 'CreateLabo']);//works

Route::get('GetAllLabos', [LaboController::class, 'GetAllLabos']);//works
Route::get('GetAllLabosInfos', [LaboController::class, 'GetAllLabosInfos']);//works
Route::get('GetLaboInfosByLaboId/{id}', [LaboController::class, 'GetLaboInfosByLaboId']);//woorks
Route::get('GetAllLaboNames', [LaboController::class, 'GetAllLaboNames']);//works
Route::get('GetLaboInfoByLabName/{Name}', [LaboController::class, 'GetLaboInfoByLabName']);//works
Route::get('GetLaboByLabName/{Name}', [LaboController::class, 'GetLaboByLabName']);//works


//ActivitiesController
Route::post('CreateActivityByLabo', action: [ActivitiesController::class,'CreateActivityByLabo']);//work

Route::get('getAllActivity', action: [ActivitiesController::class, 'getAllActivity']);//works
Route::get('getActivityById/{id}', action: [ActivitiesController::class, 'getActivityById']);//works



