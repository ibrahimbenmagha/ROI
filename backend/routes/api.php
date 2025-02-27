<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LaboController;
use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\Activity1;
use App\Http\Controllers\Activity2;
use App\Http\Controllers\Activity3;



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
Route::post('CreateActivityByLabo',  [ActivitiesController::class,'CreateActivityByLabo']);//work

Route::get('getAllActivity',  [ActivitiesController::class, 'getAllActivity']);//works
Route::get('getAllActivitiesByLabo',  [ActivitiesController::class, 'getAllActivitiesByLabo']);//works
Route::get('getActivityById/{id}',  [ActivitiesController::class, 'getActivityById']);//works
Route::get('getActivityByName/{Name}',  [ActivitiesController::class, 'getActivityByName']);//works
Route::get('getAllActivitiesByLaboInfos',  [ActivitiesController::class, 'getAllActivitiesByLaboInfos']);//works
Route::get('getActivitiesByLaboInfosById/{id}',  [ActivitiesController::class, 'getActivitiesByLaboInfosById']);//works
Route::get('getAllActivityByLaboInfosByLaboId/{id}',  [ActivitiesController::class, 'getAllActivityByLaboInfosByLaboId']);//works
Route::get('getAllActivityByLaboName/{Name}',  [ActivitiesController::class, 'getAllActivityByLaboName']);//Not working
Route::get('getActivityRepportBYActivityId/{activityListId}',  [ActivitiesController::class,'getActivityRepportBYActivityId']);
Route::get('getActivityRepport',  [ActivitiesController::class,'getActivityRepport']);
Route::delete('deleteActivityValues/{ActivityByLaboId}',  [ActivitiesController::class,'deleteActivityValues']);


//activity 1
Route::post('calculateROIAct1',  [Activity1::class,'calculateROIAct1']);//work   
Route::post('insetrIntoTable1',  [Activity1::class,'insetrIntoTable1']);//work   
Route::post('updateActivity1Values',  [Activity1::class,'updateActivity1Values']);//work   

//activity 2
Route::post('calculateROIAct2',  [Activity2::class,'calculateROIAct2']);//work   
Route::post('insertIntoTable2',  [Activity2::class,'insertIntoTable2']);//work   
Route::post('updateActivity2Values',  [Activity2::class,'updateActivity2Values']);//work   

//activity 3
Route::post('calculateROIAct3',  [Activity3::class,'calculateROIAct3']);//work   
Route::post('insertIntoTable3',  [Activity3::class,'insertIntoTable3']);
Route::post('updateActivity3Values',  [Activity3::class,'updateActivity3Values']);

