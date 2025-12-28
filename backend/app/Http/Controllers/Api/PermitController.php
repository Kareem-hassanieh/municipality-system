<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permit;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PermitController extends Controller
{
    public function index(): JsonResponse
    {
        $permits = Permit::with(['citizen', 'department', 'reviewedBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return response()->json([
            'success' => true,
            'data' => $permits
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'citizen_id' => 'required|exists:citizens,id',
            'department_id' => 'nullable|exists:departments,id',
            'reviewed_by' => 'nullable|exists:users,id',
            'type' => 'required|in:business,construction,vehicle,event,other',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,under_review,approved,rejected,expired',
            'application_date' => 'required|date',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'fee' => 'numeric|min:0',
            'is_paid' => 'boolean',
            'rejection_reason' => 'nullable|string',
        ]);

        $validated['status'] = $validated['status'] ?? 'pending';

        $permit = Permit::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Permit application submitted successfully',
            'data' => $permit
        ], 201);
    }

    public function show(Permit $permit): JsonResponse
    {
        $permit->load(['citizen', 'department', 'reviewedBy', 'documents']);
        return response()->json([
            'success' => true,
            'data' => $permit
        ]);
    }

    public function update(Request $request, Permit $permit): JsonResponse
    {
        $validated = $request->validate([
            'department_id' => 'nullable|exists:departments,id',
            'reviewed_by' => 'nullable|exists:users,id',
            'type' => 'sometimes|required|in:business,construction,vehicle,event,other',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:pending,under_review,approved,rejected,expired',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'fee' => 'numeric|min:0',
            'is_paid' => 'boolean',
            'rejection_reason' => 'nullable|string',
        ]);

        $permit->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Permit updated successfully',
            'data' => $permit
        ]);
    }

    public function destroy(Permit $permit): JsonResponse
    {
        $permit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Permit deleted successfully'
        ]);
    }
}