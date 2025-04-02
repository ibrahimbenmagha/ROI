<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LaboController;
use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\activityitems;
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
    Route::get('check', [AuthController::class, 'checkAuth']);
    Route::get('checkActivity', [AuthController::class, 'checkActivity']);
});

// Routes pour Admin
Route::middleware(['check.role:Admin'])->group(function () {
    Route::post('CreateLabo', [LaboController::class, 'CreateLabo']);
    Route::get('GetAllLabos', [LaboController::class, 'GetAllLabos']);
    Route::get('GetAllLabosInfos', [LaboController::class, 'GetAllLabosInfos']);
    Route::get('GetAllLaboNames', [LaboController::class, 'GetAllLaboNames']);
    Route::get('GetLaboInfoByLabName/{Name}', [LaboController::class, 'GetLaboInfoByLabName']);
    Route::get('GetLaboByLabName/{Name}', [LaboController::class, 'GetLaboByLabName']);
    
    Route::post('createActivity', [ActivitiesController::class, 'createActivity']);
    Route::get('getAllActivity', [ActivitiesController::class, 'getAllActivity']);
    Route::get('getAllActivitiesByLaboInfos', [ActivitiesController::class, 'getAllActivitiesByLaboInfos']);
    Route::get('getActivitiesByLaboInfosById/{id}', [ActivitiesController::class, 'getActivitiesByLaboInfosById']);
    Route::get('getAllActivityByLaboName/{Name}', [ActivitiesController::class, 'getAllActivityByLaboName']);
    Route::get('getAllActivitiesByLabo', [ActivitiesController::class, 'getAllActivitiesByLabo']);
});

// Routes pour Labo (ajustez le rôle si nécessaire)
Route::middleware(['check.role:Laboratoire'])->group(function () {
    Route::get('GetLaboInfosByLaboId/{id}', [LaboController::class, 'GetLaboInfosByLaboId']);
    Route::get('getAllActivityByLaboInfosByLaboId', [ActivitiesController::class, 'getAllActivityByLaboInfosByLaboId']);
    Route::post('CreateActivityByLabo', [ActivitiesController::class, 'CreateActivityByLabo']);
    
    // Routes spécifiques pour les activités
    Route::post("calculateROIAct1", [Activity1::class, "calculateROIAct1"]);
    Route::post("insertIntoTable1", [Activity1::class, "insertIntoTable1"]);
    Route::post("updateActivity1Values", [Activity1::class, "updateActivity1Values"]);

    Route::post("calculateROIAct2", [Activity2::class, "calculateROIAct2"]);
    Route::post("insertIntoTable2", [Activity2::class, "insertIntoTable2"]);
    Route::post("updateActivity2Values", [Activity2::class, "updateActivity2Values"]);

    Route::post("calculateROIAct3", [Activity3::class, "calculateROIAct3"]);
    Route::post("insertIntoTable3", [Activity3::class, "insertIntoTable3"]);
    Route::post("updateActivity3Values", [Activity3::class, "updateActivity3Values"]);

    Route::post("calculateROIAct4", [Activity4::class, "calculateROIAct4"]);
    Route::post("insertIntoTable4", [Activity4::class, "insertIntoTable4"]);
    Route::post("updateActivity4Values", [Activity4::class, "updateActivity4Values"]);

    Route::post("calculateROIAct5", [Activity5::class, "calculateROIAct5"]);
    Route::post("insertIntoTable5", [Activity5::class, "insertIntoTable5"]);
    Route::post("updateActivity5Values", [Activity5::class, "updateActivity5Values"]);

    Route::post("calculateROIAct6", [Activity6::class, "calculateROIAct6"]);
    Route::post("insertIntoTable6", [Activity6::class, "insertIntoTable6"]);
    Route::post("updateActivity6Values", [Activity6::class, "updateActivity6Values"]);

});

// Routes accessibles à tous les utilisateurs authentifiés
Route::middleware('check.role:Admin,Laboratoire')->group(function () {
    Route::get('getAllActivityNotCustum', [ActivitiesController::class, 'getAllActivityNotCustum']);
    Route::get('getActivityById/{id}', [ActivitiesController::class, 'getActivityById']);
    Route::get('getActivityByName/{Name}', [ActivitiesController::class, 'getActivityByName']);
    
    Route::get('getActivityItems', [activityitems::class, 'getActivityItems']);
    Route::get('getActivityItemById/{id}', [activityitems::class, 'getActivityItemById']);
    Route::get('getActivityItemsByActivityId/{activityId}', [activityitems::class, 'getActivityItemsByActivityId']);
});
