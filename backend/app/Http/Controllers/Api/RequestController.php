<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request as ServiceRequest;
use App\Models\Citizen;
use App\Notifications\RequestStatusNotification;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    public function index()
    {
        try {
            $requests = ServiceRequest::with(['citizen', 'department', 'assignedTo'])->get();
            return response()->json($requests);
        } catch (\Exception $e) {
            $requests = ServiceRequest::all();
            return response()->json($requests);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'citizen_id' => 'nullable|integer',
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

        // Send notification to citizen
        $this->notifyCitizen($serviceRequest);

        return response()->json($serviceRequest, 201);
    }

    public function show(ServiceRequest $request)
    {
        try {
            $request->load(['citizen', 'department', 'assignedTo']);
        } catch (\Exception $e) {
        }
        return response()->json($request);
    }

    public function update(Request $httpRequest, ServiceRequest $request)
    {
        $oldStatus = $request->status;

        $validated = $httpRequest->validate([
            'type' => 'sometimes|string|max:50',
            'subject' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:pending,in_progress,completed,approved,rejected',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'admin_notes' => 'nullable|string',
        ]);

        if ($httpRequest->has('status') && $httpRequest->status === 'completed' && !$request->completion_date) {
            $validated['completion_date'] = now();
        }

        $updateData = [];
        foreach ($validated as $key => $value) {
            if ($httpRequest->has($key)) {
                $updateData[$key] = $value;
            }
        }

        if (!empty($updateData)) {
            $request->update($updateData);
        }

        // Send notification if status changed
        if ($httpRequest->has('status') && $oldStatus !== $request->status) {
            $this->notifyCitizen($request, $oldStatus);
        }

        $freshRequest = $request->fresh();
        try {
            $freshRequest->load(['citizen', 'department', 'assignedTo']);
        } catch (\Exception $e) {
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

    private function notifyCitizen(ServiceRequest $serviceRequest, string $oldStatus = null)
    {
        if ($serviceRequest->citizen_id) {
            $citizen = Citizen::with('user')->find($serviceRequest->citizen_id);
            if ($citizen && $citizen->user) {
                $citizen->user->notify(new RequestStatusNotification($serviceRequest, $oldStatus));
            }
        }
    }
}