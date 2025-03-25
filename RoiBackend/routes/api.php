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
});


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
Route::get('getAllActivityByLaboInfosByLaboId/{laboId}', [ActivitiesController::class, 'getAllActivityByLaboInfosByLaboId']);
Route::get('getAllActivityByLaboName/{Name}', [ActivitiesController::class, 'getAllActivityByLaboName']);
Route::get('getActivityRepportBYActivityId/{activityListId}', [ActivitiesController::class, 'getActivityRepportBYActivityId']);
Route::get('getActivityRepport', [ActivitiesController::class, 'getActivityRepport']);
Route::delete('deleteActivityValues/{ActivityByLaboId}', [ActivitiesController::class, 'deleteActivityValues']);


//ActivityItemsController
Route::get('getActivityItems', [activityitems::class, 'getActivityItems']);
Route::get('getActivityItemById/{id}', [activityitems::class, 'getActivityItemById']);
Route::get('getActivityItemsByActivityId/{activityId}', [activityitems::class, 'getActivityItemsByActivityId']);



Route::post("calculateROIAct1", [Activity1::class, "calculateROIAct1"]);
Route::post("insetrIntoTable1", [Activity1::class, "insetrIntoTable1"]);
Route::post("updateActivity1Values", [Activity1::class, "updateActivity1Values"]);

Route::post("calculateROIAct2", [Activity2::class, "calculateROIAct2"]);
Route::post("insertIntoTable2", [Activity2::class, "insertIntoTable2"]);
Route::post("updateActivity2Values", [Activity2::class, "updateActivity2Values"]);

Route::post("calculateROIAct2", [Activity2::class, "calculateROIAct2"]);
Route::post("insertIntoTable3", [Activity3::class, "insertIntoTable3"]);
Route::post("updateActivity3Values", [Activity3::class, "updateActivity3Values"]);