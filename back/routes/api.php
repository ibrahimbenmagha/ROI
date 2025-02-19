<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::prefix('api')->group(function () {
Route::post('register', [AuthController::class, 'Create_Admin']);
Route::post('login', [AuthController::class, 'login']);
Route::get('user', [AuthController::class, 'getAuthUser'])->middleware('auth:api');
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');

// });
