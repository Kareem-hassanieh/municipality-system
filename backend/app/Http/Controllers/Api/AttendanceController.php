<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AttendanceController extends Controller
{
    public function index(): JsonResponse
    {
        $attendance = Attendance::with('employee')
            ->orderBy('date', 'desc')
            ->paginate(15);
            
        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i',
            'hours_worked' => 'nullable|numeric|min:0',
            'status' => 'in:present,absent,late,half_day,leave',
            'notes' => 'nullable|string',
        ]);

        $validated['status'] = $validated['status'] ?? 'present';

        // Calculate hours worked if check_in and check_out provided
        if (!empty($validated['check_in']) && !empty($validated['check_out'])) {
            $checkIn = \Carbon\Carbon::createFromFormat('H:i', $validated['check_in']);
            $checkOut = \Carbon\Carbon::createFromFormat('H:i', $validated['check_out']);
            $validated['hours_worked'] = $checkOut->diffInMinutes($checkIn) / 60;
        }

        $attendance = Attendance::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Attendance recorded successfully',
            'data' => $attendance
        ], 201);
    }

    public function show(Attendance $attendance): JsonResponse
    {
        $attendance->load('employee');
        return response()->json([
            'success' => true,
            'data' => $attendance
        ]);
    }

    public function update(Request $request, Attendance $attendance): JsonResponse
    {
        $validated = $request->validate([
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i',
            'hours_worked' => 'nullable|numeric|min:0',
            'status' => 'in:present,absent,late,half_day,leave',
            'notes' => 'nullable|string',
        ]);

        // Recalculate hours worked if times updated
        $checkIn = $validated['check_in'] ?? ($attendance->check_in ? $attendance->check_in->format('H:i') : null);
        $checkOut = $validated['check_out'] ?? ($attendance->check_out ? $attendance->check_out->format('H:i') : null);
        
        if ($checkIn && $checkOut) {
            $in = \Carbon\Carbon::createFromFormat('H:i', $checkIn);
            $out = \Carbon\Carbon::createFromFormat('H:i', $checkOut);
            $validated['hours_worked'] = $out->diffInMinutes($in) / 60;
        }

        $attendance->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Attendance updated successfully',
            'data' => $attendance
        ]);
    }

    public function destroy(Attendance $attendance): JsonResponse
    {
        $attendance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Attendance deleted successfully'
        ]);
    }
}