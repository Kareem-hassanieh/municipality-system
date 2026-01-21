<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request as ServiceRequest;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    public function index()
    {
        try {
            $requests = ServiceRequest::with(['citizen', 'department', 'assignedTo'])->get();
            return response()->json($requests);
        } catch (\Exception $e) {
            // Fallback to basic query if relationships fail
            $requests = ServiceRequest::all();
            return response()->json($requests);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:pending,in_progress,completed,approved,rejected',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
        ]);

        $validated['status'] = $validated['status'] ?? 'pending';
        $validated['priority'] = $validated['priority'] ?? 'medium';
        $validated['submission_date'] = now();

        $serviceRequest = ServiceRequest::create($validated);
        return response()->json($serviceRequest, 201);
    }

    public function show(ServiceRequest $request)
    {
        try {
            $request->load(['citizen', 'department', 'assignedTo']);
        } catch (\Exception $e) {
            // Continue without relationships if loading fails
        }
        return response()->json($request);
    }

    public function update(Request $httpRequest, ServiceRequest $request)
    {
        $validated = $httpRequest->validate([
            'type' => 'sometimes|string|max:50',
            'subject' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:pending,in_progress,completed,approved,rejected',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'admin_notes' => 'nullable|string',
        ]);

        // Auto-set completion_date when status changes to completed
        if ($httpRequest->has('status') && $httpRequest->status === 'completed' && !$request->completion_date) {
            $validated['completion_date'] = now();
        }

        // Only update fields that are present in the request to prevent data loss
        $updateData = [];
        foreach ($validated as $key => $value) {
            if ($httpRequest->has($key)) {
                $updateData[$key] = $value;
            }
        }

        // Update the request record
        if (!empty($updateData)) {
            $request->update($updateData);
        }

        // Return fresh data with relationships
        $freshRequest = $request->fresh();
        try {
            $freshRequest->load(['citizen', 'department', 'assignedTo']);
        } catch (\Exception $e) {
            // Continue without relationships if loading fails
        }
        return response()->json($freshRequest);
    }

    public function destroy(ServiceRequest $request)
    {
        try {
            $request->delete();
            return response()->json(['message' => 'Request deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting request: ' . $e->getMessage()
            ], 500);
        }
    }
}