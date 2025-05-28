<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LaboController;
use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\activityitems;
use App\Http\Controllers\InterpretationController;

use App\Http\Controllers\Activity1_12;






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
    Route::delete('deleteLaboWithData', [LaboController::class, 'deleteLaboWithData']);
    Route::get('getAllActivitiesInfo', [ActivitiesController::class, 'getAllActivitiesInfo']);

    Route::post('createActivity', [ActivitiesController::class, 'createActivity']);
    Route::get('getLaboWithActivities', [ActivitiesController::class, 'getLaboWithActivities']);
    Route::get('getAllActivity', [ActivitiesController::class, 'getAllActivity']);
    Route::get('getAllActivitiesByLaboInfos', [ActivitiesController::class, 'getAllActivitiesByLaboInfos']);
    Route::get('getActivitiesByLaboInfosById/{id}', [ActivitiesController::class, 'getActivitiesByLaboInfosById']);
    Route::get('getAllActivityByLaboName/{Name}', [ActivitiesController::class, 'getAllActivityByLaboName']);
    Route::get('getAllActivitiesByLabo', [ActivitiesController::class, 'getAllActivitiesByLabo']);
    Route::put('/activity/{id}', [ActivitiesController::class, 'updateActivity']);
});



Route::middleware(['check.role:Laboratoire'])->group(function () {

    Route::post('/verify-password', [AuthController::class, 'verifyPassword']);

    Route::get('GetLaboInfosByLaboId/{id}', [LaboController::class, 'GetLaboInfosByLaboId']);

    Route::patch("updateActivityByLaboData", [Activity1_12::class, "updateActivityByLaboData"]);

    Route::post("insertCustomActivity", [Activity1_12::class, "insertCustomActivity"]);
    Route::post("insertCustomActivity1", [Activity1_12::class, "insertCustomActivity1"]);
    Route::post('insertActivityData', [Activity1_12::class, 'insertActivityData']);
    Route::post('calculateRoi', [Activity1_12::class, 'calculateRoi']);

    Route::post('/generate-interpretation', [InterpretationController::class, 'generate']);

    Route::get('exportActivityCsv', [ActivitiesController::class, 'exportActivityCsv']);
    Route::get('exportAllActivitiesCsv', [ActivitiesController::class, 'exportAllActivitiesCsv']);

    Route::delete('deleteLaboData', [ActivitiesController::class, 'deleteLaboData']);
    Route::post('CreateActivityByLabo', [ActivitiesController::class, 'CreateActivityByLabo']);
    Route::get('getAllActivityByLaboInfosByLaboId', [ActivitiesController::class, 'getAllActivityByLaboInfosByLaboId']);
    Route::delete('deleteActivityValues', [ActivitiesController::class, 'deleteActivityValues']);
    Route::delete('deletelabovalues', [ActivitiesController::class, 'deletelabovalues']);
});





Route::middleware('check.role:Admin,Laboratoire')->group(function () {

    Route::get('getAllActivityNotCustum', [ActivitiesController::class, 'getAllActivityNotCustum']);
    Route::get('getActivityById/{id}', [ActivitiesController::class, 'getActivityById']);
    Route::get('getActivityByName/{Name}', [ActivitiesController::class, 'getActivityByName']);
    Route::get('getAllCalculatedActivityByLaboInfosByLaboId', [ActivitiesController::class, 'getAllCalculatedActivityByLaboInfosByLaboId']);
    Route::get('calculateDynamicROI', [ActivitiesController::class, 'calculateDynamicROI']);
    Route::get('getActivityByLaboData', [ActivitiesController::class, 'getActivityByLaboData']);

    Route::get('getActivityItems', [activityitems::class, 'getActivityItems']);
    Route::get('getActivityItemById/{id}', [activityitems::class, 'getActivityItemById']);
    Route::get('getActivityItemsByActivityId/{activityId}', [activityitems::class, 'getActivityItemsByActivityId']);
    Route::get('getActivityItemsByActivityIdall', [activityitems::class, 'getActivityItemsByActivityIdall']);
});
