<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EmployeeController extends Controller
{
    public function index(): JsonResponse
    {
        $employees = Employee::with(['user', 'department'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return response()->json([
            'success' => true,
            'data' => $employees
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'department_id' => 'nullable|exists:departments,id',
            'employee_id' => 'required|string|unique:employees',
            'position' => 'required|string|max:255',
            'employment_type' => 'required|in:full_time,part_time,contract',
            'hire_date' => 'required|date',
            'termination_date' => 'nullable|date',
            'salary' => 'required|numeric|min:0',
            'bank_account' => 'nullable|string|max:255',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $validated['is_active'] ?? true;

        $employee = Employee::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully',
            'data' => $employee
        ], 201);
    }

    public function show(Employee $employee): JsonResponse
    {
        $employee->load(['user', 'department', 'attendance']);
        return response()->json([
            'success' => true,
            'data' => $employee
        ]);
    }

    public function update(Request $request, Employee $employee): JsonResponse
    {
        $validated = $request->validate([
            'department_id' => 'nullable|exists:departments,id',
            'employee_id' => 'sometimes|required|string|unique:employees,employee_id,' . $employee->id,
            'position' => 'sometimes|required|string|max:255',
            'employment_type' => 'sometimes|required|in:full_time,part_time,contract',
            'hire_date' => 'sometimes|required|date',
            'termination_date' => 'nullable|date',
            'salary' => 'sometimes|required|numeric|min:0',
            'bank_account' => 'nullable|string|max:255',
            'emergency_contact' => 'nullable|string|max:255',
            'emergency_phone' => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $employee->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Employee updated successfully',
            'data' => $employee
        ]);
    }

    public function destroy(Employee $employee): JsonResponse
    {
        $employee->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully'
        ]);
    }
}