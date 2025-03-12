<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LaboController;
use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\Activity1;
use App\Http\Controllers\Activity2;
use App\Http\Controllers\Activity3;
use App\Http\Controllers\Activity4;
use App\Http\Controllers\Activity5;
use App\Http\Controllers\Activity6;
use App\Http\Controllers\Activity7;
use App\Http\Controllers\Activity8;
use App\Http\Controllers\Activity9;
use App\Http\Controllers\Activity10;

// Routes publiques (pas besoin d'authentification)
Route::prefix('auth')->group(function () {
    Route::post('loginadmin', [AuthController::class, 'loginadmin']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('logout', [AuthController::class, 'logout']);
});

// Routes protégées (nécessitent l'authentification)
// Route::middleware('auth:api')->group(function () {
    
    // LaboController
    Route::post('CreateLabo', [LaboController::class, 'CreateLabo']);
    Route::get('GetAllLabos', [LaboController::class, 'GetAllLabos']);
    Route::get('GetAllLabosInfos', [LaboController::class, 'GetAllLabosInfos']);
    Route::get('GetLaboInfosByLaboId/{id}', [LaboController::class, 'GetLaboInfosByLaboId']);
    Route::get('GetAllLaboNames', [LaboController::class, 'GetAllLaboNames']);
    Route::get('GetLaboInfoByLabName/{Name}', [LaboController::class, 'GetLaboInfoByLabName']);
    Route::get('GetLaboByLabName/{Name}', [LaboController::class, 'GetLaboByLabName']);

    // ActivitiesController 
    Route::post('CreateActivityByLabo', [ActivitiesController::class, 'CreateActivityByLabo']);
    Route::post('createActivity', [ActivitiesController::class, 'createActivity']);
    Route::get('getAllActivityNotCustum', [ActivitiesController::class, 'getAllActivityNotCustum']);
    Route::get('getAllActivity', [ActivitiesController::class, 'getAllActivity']);
    Route::get('getAllActivitiesByLabo', [ActivitiesController::class, 'getAllActivitiesByLabo']);
    Route::get('getActivityById/{id}', [ActivitiesController::class, 'getActivityById']);
    Route::get('getActivityByName/{Name}', [ActivitiesController::class, 'getActivityByName']);
    Route::get('getAllActivitiesByLaboInfos', [ActivitiesController::class, 'getAllActivitiesByLaboInfos']);
    Route::get('getActivitiesByLaboInfosById/{id}', [ActivitiesController::class, 'getActivitiesByLaboInfosById']);
    Route::get('getAllActivityByLaboInfosByLaboId/{id}', [ActivitiesController::class, 'getAllActivityByLaboInfosByLaboId']);
    Route::get('getAllActivityByLaboName/{Name}', [ActivitiesController::class, 'getAllActivityByLaboName']);
    Route::get('getActivityRepportBYActivityId/{activityListId}', [ActivitiesController::class, 'getActivityRepportBYActivityId']);
    Route::get('getActivityRepport', [ActivitiesController::class, 'getActivityRepport']);
    Route::delete('deleteActivityValues/{ActivityByLaboId}', [ActivitiesController::class, 'deleteActivityValues']);

    // Activities ROI Calculations
    for ($i = 1; $i <= 10; $i++) {
        Route::post("calculateROIAct$i", ["Activity$i", "calculateROIAct$i"]);
        Route::post("insertIntoTable$i", ["Activity$i", "insertIntoTable$i"]);
        Route::post("updateActivity{$i}Values", ["Activity$i", "updateActivity{$i}Values"]);
    }
// });
