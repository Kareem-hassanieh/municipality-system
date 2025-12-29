<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\CitizenController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\PermitController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\CitizenPortalController;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::apiResource('departments', DepartmentController::class);
    Route::apiResource('citizens', CitizenController::class);
    Route::apiResource('requests', RequestController::class);
    Route::apiResource('permits', PermitController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('employees', EmployeeController::class);
    Route::apiResource('attendance', AttendanceController::class);
    Route::apiResource('events', EventController::class);
    Route::apiResource('documents', DocumentController::class);

    // Citizen Portal Routes
    Route::get('/my/profile', [CitizenPortalController::class, 'profile']);
    Route::put('/my/profile', [CitizenPortalController::class, 'updateProfile']);
    Route::get('/my/requests', [CitizenPortalController::class, 'requests']);
    Route::post('/my/requests', [CitizenPortalController::class, 'createRequest']);
    Route::get('/my/permits', [CitizenPortalController::class, 'permits']);
    Route::post('/my/permits', [CitizenPortalController::class, 'applyPermit']);
    Route::get('/my/payments', [CitizenPortalController::class, 'payments']);
    Route::post('/my/payments/{payment}/pay', [CitizenPortalController::class, 'payBill']);
});