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
use App\Http\Controllers\Activity11;
use App\Http\Controllers\Activity12;






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

Route::get('getCalculatedActivityData', [ActivitiesController::class, 'getCalculatedActivityData']);


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
// Route::get("calculateROIAct1", [Activity1::class, "calculateROIAct1"]);
// Route::get("calculateROIAct_1", [Activity1::class, "calculateROIAct_1"]);
// Route::post("insetrIntoTable1", [Activity1::class, "insetrIntoTable1"]);
// Route::post("updateActivity1Values", [Activity1::class, "updateActivity1Values"]);
// Routes pour Labo (ajustez le rôle si nécessaire)
Route::middleware(['check.role:Laboratoire'])->group(function () {
    // deleteByLabo
    Route::get('GetLaboInfosByLaboId/{id}', [LaboController::class, 'GetLaboInfosByLaboId']);
    Route::get('getAllActivityByLaboInfosByLaboId', [ActivitiesController::class, 'getAllActivityByLaboInfosByLaboId']);
    Route::get('getAllCalculatedActivityByLaboInfosByLaboId', [ActivitiesController::class, 'getAllCalculatedActivityByLaboInfosByLaboId']);

    Route::get('getCalculatedActivityData', [ActivitiesController::class, 'getCalculatedActivityData']);

    Route::post('CreateActivityByLabo', [ActivitiesController::class, 'CreateActivityByLabo']);

    Route::delete('deleteLaboData', [ActivitiesController::class, 'deleteLaboData']);

    Route::post('/verify-password', [AuthController::class, 'verifyPassword']);

    Route::post("calculateROIAct1", [Activity1::class, "calculateROIAct1"]);
    Route::get("calculateROIAct_1", [Activity1::class, "calculateROIAct_1"]);
    Route::post("insetrIntoTable1", [Activity1::class, "insetrIntoTable1"]);
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

    // Route::post("calculateROIAct6", [Activity6::class, "calculateROIAct6"]);
    Route::post("insertIntoTable6", [Activity6::class, "insertIntoTable6"]);
    Route::post("updateActivity6Values", [Activity6::class, "updateActivity6Values"]);

    Route::post("calculateROIAct7", [Activity7::class, "calculateROIAct7"]);
    Route::post("insertIntoTable7", [Activity7::class, "insertIntoTable7"]);
    Route::post("updateActivity7Values", [Activity7::class, "updateActivity7Values"]);

    Route::post("calculateROIAct8", [Activity8::class, "calculateROIAct8"]);
    Route::post("insertIntoTable8", [Activity8::class, "insertIntoTable8"]);
    Route::post("updateActivity8Values", [Activity8::class, "updateActivity8Values"]);

    Route::post("calculateROIAct9", [Activity9::class, "calculateROIAct9"]);
    Route::post("insertIntoTable9", [Activity9::class, "insertIntoTable9"]);
    Route::post("updateActivity9Values", [Activity9::class, "updateActivity9Values"]);

    Route::post("calculateROIAct10", [Activity10::class, "calculateROIAct10"]);
    Route::post("insertIntoTable10", [Activity10::class, "insertIntoTable10"]);
    Route::post("updateActivity10Values", [Activity10::class, "updateActivity10Values"]);

    Route::post("calculateROIAct11", [Activity11::class, "calculateROIAct11"]);
    Route::post("insertIntoTable11", [Activity11::class, "insertIntoTable11"]);
    Route::post("updateActivity11Values", [Activity11::class, "updateActivity11Values"]);

    Route::post("calculateROIAct11", [Activity12::class, "calculateROIAct12"]);
    Route::post("insertIntoTable12", [Activity12::class, "insertIntoTable12"]);
    Route::post("updateActivity12Values", [Activity12::class, "updateActivity12Values"]);
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
