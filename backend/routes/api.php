<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LaboController;
use App\Http\Controllers\ActivitiesController;
use App\Http\Controllers\Activity1;
use App\Http\Controllers\Activity2;
use App\Http\Controllers\Activity3;
use App\Http\Controllers\activity4;
use App\Http\Controllers\Activity5;
use App\Http\Controllers\Activity6;
use App\Http\Controllers\Activity7;
use App\Http\Controllers\Activity8;
use App\Http\Controllers\Activity9;
use App\Http\Controllers\Activity10;




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
Route::post('insertIntoTable3',  [Activity3::class,'insertIntoTable3']);//work   
Route::post('updateActivity3Values',  [Activity3::class,'updateActivity3Values']);

//activity 4
Route::post('calculateROIAct4',  [Activity4::class,'calculateROIAct4']);//work   
Route::post('insertIntoTable4',  [Activity4::class,'insertIntoTable4']);//work   
Route::post('updateActivity4Values',  [Activity4::class,'updateActivity4Values']);//work   

//activity 5
Route::post('calculateROIAct5', [Activity5::class,'calculateROIAct5']);//work   
Route::post('insertIntoTable5', [Activity5::class,'insertIntoTable5']);//work   
Route::post('updateActivity5Values', [Activity5::class,'updateActivity5Values']);//work   

//activity 6
Route::post('calculateROIAct6', [Activity6::class,'calculateROIAct6']);//work   
Route::post('insertIntoTable6', [Activity6::class,'insertIntoTable6']);//work   
Route::post('updateActivity6Values', [Activity6::class,'updateActivity6Values']);//work   

//activity 7
Route::post('calculateROIAct7', [Activity7::class,'calculateROIAct7']);//work   
Route::post('insertIntoTable7', [Activity7::class,'insertIntoTable7']);//work   
Route::post('updateActivity7Values', [Activity7::class,'updateActivity7Values']);//work   


//activity 8
Route::post('calculateROIAct8', [Activity8::class,'calculateROIAct8']);//work   
Route::post('insertIntoTable8', [Activity8::class,'insertIntoTable8']);//work   
Route::post('updateActivity8Values', [Activity8::class,'updateActivity8Values']);//work   

//activity 9
Route::post('calculateROIAct9', [Activity9::class,'calculateROIAct9']);//work   
Route::post('insertIntoTable9', [Activity9::class,'insertIntoTable9']);//work   
Route::post('updateActivity9Values', [Activity9::class,'updateActivity9Values']);//work   

//activity 10
Route::post('calculateROIAct10', [Activity10::class,'calculateROIAct10']);//work   
Route::post('insertIntoTable10', [Activity10::class,'insertIntoTable10']);//work   
Route::post('updateActivity10Values', [Activity10::class,'updateActivity10Values']);//work   


