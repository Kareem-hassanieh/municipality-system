<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use Illuminate\Http\Request;

class CitizenController extends Controller
{
    public function index()
    {
        $citizens = Citizen::all();
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

        // Handle date separately
        if ($request->has('date_of_birth')) {
            $validated['date_of_birth'] = $request->date_of_birth ?: null;
        }

        // Convert is_verified to boolean
        if ($request->has('is_verified')) {
            $validated['is_verified'] = filter_var($request->is_verified, FILTER_VALIDATE_BOOLEAN);
        }

        $citizen->update($validated);
        return response()->json($citizen);
    }

    public function destroy(Citizen $citizen)
    {
        $citizen->delete();
        return response()->json(null, 204);
    }
}