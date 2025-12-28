<?php

use Illuminate\Support\Facades\Route;
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

// Public routes
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