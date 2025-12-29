<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::all();
        return response()->json($employees);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|string|max:50',
            'position' => 'nullable|string|max:100',
            'employment_type' => 'nullable|string|in:full_time,part_time,contract',
            'hire_date' => 'nullable|date',
            'salary' => 'nullable|numeric',
            'is_active' => 'nullable',
        ]);

        $validated['employment_type'] = $validated['employment_type'] ?? 'full_time';
        $validated['is_active'] = filter_var($request->is_active ?? true, FILTER_VALIDATE_BOOLEAN);

        $employee = Employee::create($validated);
        return response()->json($employee, 201);
    }

    public function show(Employee $employee)
    {
        return response()->json($employee);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'employee_id' => 'sometimes|string|max:50',
            'position' => 'nullable|string|max:100',
            'employment_type' => 'nullable|string|in:full_time,part_time,contract',
            'hire_date' => 'nullable|date',
            'termination_date' => 'nullable|date',
            'salary' => 'nullable|numeric',
            'is_active' => 'nullable',
        ]);

        if ($request->has('is_active')) {
            $validated['is_active'] = filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN);
        }

        // If terminated, set is_active to false
        if (isset($validated['termination_date']) && $validated['termination_date']) {
            $validated['is_active'] = false;
        }

        $employee->update($validated);
        return response()->json($employee);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return response()->json(null, 204);
    }
}