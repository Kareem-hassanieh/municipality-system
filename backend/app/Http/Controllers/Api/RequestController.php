<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request as CitizenRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RequestController extends Controller
{
    public function index(): JsonResponse
    {
        $requests = CitizenRequest::with(['citizen', 'department', 'assignedTo'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return response()->json([
            'success' => true,
            'data' => $requests
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'citizen_id' => 'required|exists:citizens,id',
            'department_id' => 'nullable|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'type' => 'required|in:certificate,complaint,service,inquiry',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'status' => 'in:pending,in_progress,approved,rejected,completed',
            'priority' => 'in:low,medium,high,urgent',
            'admin_notes' => 'nullable|string',
            'submission_date' => 'required|date',
            'completion_date' => 'nullable|date',
        ]);

        $validated['status'] = $validated['status'] ?? 'pending';
        $validated['priority'] = $validated['priority'] ?? 'medium';

        $citizenRequest = CitizenRequest::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Request submitted successfully',
            'data' => $citizenRequest
        ], 201);
    }

    public function show(CitizenRequest $request): JsonResponse
    {
        $request->load(['citizen', 'department', 'assignedTo', 'documents']);
        return response()->json([
            'success' => true,
            'data' => $request
        ]);
    }

    public function update(Request $httpRequest, CitizenRequest $request): JsonResponse
    {
        $validated = $httpRequest->validate([
            'department_id' => 'nullable|exists:departments,id',
            'assigned_to' => 'nullable|exists:users,id',
            'type' => 'sometimes|required|in:certificate,complaint,service,inquiry',
            'subject' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'status' => 'in:pending,in_progress,approved,rejected,completed',
            'priority' => 'in:low,medium,high,urgent',
            'admin_notes' => 'nullable|string',
            'completion_date' => 'nullable|date',
        ]);

        $request->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Request updated successfully',
            'data' => $request
        ]);
    }

    public function destroy(CitizenRequest $request): JsonResponse
    {
        $request->delete();

        return response()->json([
            'success' => true,
            'message' => 'Request deleted successfully'
        ]);
    }
}