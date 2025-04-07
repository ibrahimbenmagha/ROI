<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LaboController;
use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\activityitems;

use App\Http\Controllers\Activity1_12;
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
    Route::get('checkCalculated', [AuthController::class, 'checkCalculated']);    
});

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



Route::middleware(['check.role:Laboratoire'])->group(function () {
    Route::post('/verify-password', [AuthController::class, 'verifyPassword']);
    
    Route::get('GetLaboInfosByLaboId/{id}', [LaboController::class, 'GetLaboInfosByLaboId']);
    Route::post('CreateActivityByLabo', [ActivitiesController::class, 'CreateActivityByLabo']);
    Route::get('getAllActivityByLaboInfosByLaboId', [ActivitiesController::class, 'getAllActivityByLaboInfosByLaboId']);
    Route::get('getAllCalculatedActivityByLaboInfosByLaboId', [ActivitiesController::class, 'getAllCalculatedActivityByLaboInfosByLaboId']);
    Route::get('getCalculatedActivityData', [ActivitiesController::class, 'getCalculatedActivityData']);

    Route::get('calculateDynamicROI', [ActivitiesController::class, 'calculateDynamicROI']);


    Route::post("calculateROIAct1", [Activity1_12::class, "calculateROIAct1"]);
    Route::post("insetrIntoTable1", [Activity1_12::class, "insetrIntoTable1"]);
    Route::post("updateActivity1Values", [Activity1_12::class, "updateActivity1Values"]);

    Route::post("calculateROIAct2", [Activity1_12::class, "calculateROIAct2"]);
    Route::post("insertIntoTable2", [Activity1_12::class, "insertIntoTable2"]);
    Route::post("updateActivity2Values", [Activity1_12::class, "updateActivity2Values"]);

    Route::post("calculateROIAct3", [Activity1_12::class, "calculateROIAct3"]);
    Route::post("insertIntoTable3", [Activity1_12::class, "insertIntoTable3"]);
    Route::post("updateActivity3Values", [Activity1_12::class, "updateActivity3Values"]);

    Route::post("calculateROIAct4", [Activity1_12::class, "calculateROIAct4"]);
    Route::post("insertIntoTable4", [Activity1_12::class, "insertIntoTable4"]);
    Route::post("updateActivity4Values", [Activity1_12::class, "updateActivity4Values"]);

    Route::post("calculateROIAct5", [Activity1_12::class, "calculateROIAct5"]);
    Route::post("insertIntoTable5", [Activity1_12::class, "insertIntoTable5"]);
    Route::post("updateActivity5Values", [Activity1_12::class, "updateActivity5Values"]);

    Route::post("calculateROIAct6", [Activity1_12::class, "calculateROIAct6"]);
    Route::post("insertIntoTable6", [Activity1_12::class, "insertIntoTable6"]);
    Route::post("updateActivity6Values", [Activity1_12::class, "updateActivity6Values"]);

    Route::post("calculateROIAct7", [Activity1_12::class, "calculateROIAct7"]);
    Route::post("insertIntoTable7", [Activity1_12::class, "insertIntoTable7"]);
    Route::post("updateActivity7Values", [Activity1_12::class, "updateActivity7Values"]);

    Route::post("calculateROIAct8", [Activity1_12::class, "calculateROIAct8"]);
    Route::post("insertIntoTable8", [Activity1_12::class, "insertIntoTable8"]);
    Route::post("updateActivity8Values", [Activity1_12::class, "updateActivity8Values"]);

    Route::post("calculateROIAct9", [Activity1_12::class, "calculateROIAct9"]);
    Route::post("insertIntoTable9", [Activity1_12::class, "insertIntoTable9"]);
    Route::post("updateActivity9Values", [Activity1_12::class, "updateActivity9Values"]);

    Route::post("calculateROIAct10", [Activity1_12::class, "calculateROIAct10"]);
    Route::post("insertIntoTable10", [Activity1_12::class, "insertIntoTable10"]);
    Route::post("updateActivity10Values", [Activity1_12::class, "updateActivity10Values"]);

    Route::post("calculateROIAct11", [Activity1_12::class, "calculateROIAct11"]);
    Route::post("insertIntoTable11", [Activity1_12::class, "insertIntoTable11"]);
    Route::post("updateActivity11Values", [Activity1_12::class, "updateActivity11Values"]);

    Route::post("calculateROIAct11", [Activity1_12::class, "calculateROIAct12"]);
    Route::post("insertIntoTable12", [Activity1_12::class, "insertIntoTable12"]);
    Route::post("updateActivity12Values", [Activity1_12::class, "updateActivity12Values"]);

    Route::delete('deleteActivityValues', [ActivitiesController::class, 'deleteActivityValues']);
    Route::delete('deleteLaboData', [ActivitiesController::class, 'deleteLaboData']);
    Route::delete('deletelabovalues', [ActivitiesController::class, 'deletelabovalues']);

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
