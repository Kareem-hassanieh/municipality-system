<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permit;
use Illuminate\Http\Request;

class PermitController extends Controller
{
    public function index()
    {
        try {
            $permits = Permit::with(['citizen', 'department', 'reviewedBy'])->get();
            return response()->json($permits);
        } catch (\Exception $e) {
            // Fallback to basic query if relationships fail
            $permits = Permit::all();
            return response()->json($permits);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:pending,under_review,approved,rejected,expired',
            'fee' => 'nullable|numeric',
            'expiry_date' => 'nullable|date',
        ]);

        $validated['status'] = $validated['status'] ?? 'pending';
        $validated['application_date'] = now();
        $validated['is_paid'] = false;

        $permit = Permit::create($validated);
        return response()->json($permit, 201);
    }

    public function show(Permit $permit)
    {
        try {
            $permit->load(['citizen', 'department', 'reviewedBy']);
        } catch (\Exception $e) {
            // Continue without relationships if loading fails
        }
        return response()->json($permit);
    }

    public function update(Request $request, Permit $permit)
    {
        $validated = $request->validate([
            'type' => 'sometimes|string|max:50',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:pending,under_review,approved,rejected,expired',
            'fee' => 'nullable|numeric',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date',
            'is_paid' => 'nullable|boolean',
            'rejection_reason' => 'nullable|string',
        ]);

        // Auto-set issue_date when status changes to approved
        if ($request->has('status') && $request->status === 'approved' && !$permit->issue_date) {
            $validated['issue_date'] = now();
        }

        // Only update fields that are present in the request to prevent data loss
        $updateData = [];
        foreach ($validated as $key => $value) {
            if ($request->has($key)) {
                $updateData[$key] = $value;
            }
        }

        // Update the permit record
        if (!empty($updateData)) {
            $permit->update($updateData);
        }

        // Return fresh data with relationships
        $freshPermit = $permit->fresh();
        try {
            $freshPermit->load(['citizen', 'department', 'reviewedBy']);
        } catch (\Exception $e) {
            // Continue without relationships if loading fails
        }
        return response()->json($freshPermit);
    }

    public function destroy(Permit $permit)
    {
        try {
            $permit->delete();
            return response()->json(['message' => 'Permit deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting permit: ' . $e->getMessage()
            ], 500);
        }
    }
}