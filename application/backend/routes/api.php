<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GuestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/password-reset-request', function () {
    return response()->json(['success' => true, 'data' => null]);
});
Route::post('/auth/password-reset', function () {
    return response()->json(['success' => true, 'data' => null]);
});

Route::get('/free-session-claims/check', [GuestController::class, 'checkClaim']);
Route::post('/free-session-claims', [GuestController::class, 'createClaim']);
Route::post('/guest/register', [GuestController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
