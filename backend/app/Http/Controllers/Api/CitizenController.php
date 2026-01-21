<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use Illuminate\Http\Request;

class CitizenController extends Controller
{
    public function index()
    {
        $citizens = Citizen::with('user')->get();
        return response()->json($citizens);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'national_id' => 'required|string|max:50',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'gender' => 'nullable|string|in:male,female',
            'is_verified' => 'nullable',
        ]);

        // Handle date separately
        if ($request->date_of_birth && $request->date_of_birth !== '') {
            $validated['date_of_birth'] = $request->date_of_birth;
        }

        // Convert is_verified to boolean
        $validated['is_verified'] = filter_var($request->is_verified, FILTER_VALIDATE_BOOLEAN);

        $citizen = Citizen::create($validated);
        return response()->json($citizen, 201);
    }

    public function show(Citizen $citizen)
    {
        $citizen->load('user');
        return response()->json($citizen);
    }

    public function update(Request $request, Citizen $citizen)
    {
        $validated = $request->validate([
            'national_id' => 'sometimes|string|max:50',
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'gender' => 'nullable|string|in:male,female',
            'is_verified' => 'nullable',
        ]);

        // Handle date separately - allow null values
        if ($request->has('date_of_birth')) {
            $validated['date_of_birth'] = $request->date_of_birth ?: null;
        }

        // Convert is_verified to boolean
        if ($request->has('is_verified')) {
            $validated['is_verified'] = filter_var($request->is_verified, FILTER_VALIDATE_BOOLEAN);
        }

        // Only update fields that are present in the request to prevent data loss
        $updateData = [];
        foreach ($validated as $key => $value) {
            if ($request->has($key)) {
                $updateData[$key] = $value;
            }
        }

        // Update the citizen record
        if (!empty($updateData)) {
            $citizen->update($updateData);
        }

        // Return fresh data from database
        return response()->json($citizen->fresh());
    }

    public function destroy(Citizen $citizen)
    {
        try {
            // Check if citizen has related records before deleting
            if ($citizen->requests()->count() > 0 || 
                $citizen->permits()->count() > 0 || 
                $citizen->payments()->count() > 0) {
                return response()->json([
                    'message' => 'Cannot delete citizen with existing requests, permits, or payments'
                ], 422);
            }
            
            $citizen->delete();
            return response()->json(['message' => 'Citizen deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting citizen: ' . $e->getMessage()
            ], 500);
        }
    }
}