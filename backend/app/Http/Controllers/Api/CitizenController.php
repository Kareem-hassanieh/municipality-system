<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CitizenController extends Controller
{
    public function index(): JsonResponse
    {
        $citizens = Citizen::with('user')->paginate(15);
        return response()->json([
            'success' => true,
            'data' => $citizens
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'national_id' => 'required|string|unique:citizens',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female',
            'phone' => 'nullable|string|max:20',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'occupation' => 'nullable|string|max:255',
            'profile_photo' => 'nullable|string',
            'is_verified' => 'boolean',
        ]);

        $citizen = Citizen::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Citizen registered successfully',
            'data' => $citizen
        ], 201);
    }

    public function show(Citizen $citizen): JsonResponse
    {
        $citizen->load(['user', 'requests', 'permits', 'payments']);
        return response()->json([
            'success' => true,
            'data' => $citizen
        ]);
    }

    public function update(Request $request, Citizen $citizen): JsonResponse
    {
        $validated = $request->validate([
            'national_id' => 'sometimes|required|string|unique:citizens,national_id,' . $citizen->id,
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'date_of_birth' => 'sometimes|required|date',
            'gender' => 'sometimes|required|in:male,female',
            'phone' => 'nullable|string|max:20',
            'address' => 'sometimes|required|string|max:500',
            'city' => 'sometimes|required|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'occupation' => 'nullable|string|max:255',
            'profile_photo' => 'nullable|string',
            'is_verified' => 'boolean',
        ]);

        $citizen->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Citizen updated successfully',
            'data' => $citizen
        ]);
    }

    public function destroy(Citizen $citizen): JsonResponse
    {
        $citizen->delete();

        return response()->json([
            'success' => true,
            'message' => 'Citizen deleted successfully'
        ]);
    }
}