<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Request as ServiceRequest;
use Illuminate\Http\Request;

class RequestController extends Controller
{
    public function index()
    {
        $requests = ServiceRequest::all();
        return response()->json($requests);
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

        if ($httpRequest->status === 'completed') {
            $validated['completion_date'] = now();
        }

        $request->update($validated);
        return response()->json($request);
    }

    public function destroy(ServiceRequest $request)
    {
        $request->delete();
        return response()->json(null, 204);
    }
}