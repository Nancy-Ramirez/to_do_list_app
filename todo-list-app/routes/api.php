<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

Route::middleware('api')->group(function () {
    Route::apiResource('tasks', TaskController::class);
    Route::put('tasks/{task}/toggle-complete', [TaskController::class, 'toggleComplete']);
    Route::post('/test', function () {
        return response()->json(['message' => 'Solicitud POST recibida']);
    });
    
});  