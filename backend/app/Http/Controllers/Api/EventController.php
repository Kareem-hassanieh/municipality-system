<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    public function index(): JsonResponse
    {
        $events = Event::with(['department', 'createdBy'])
            ->orderBy('start_datetime', 'desc')
            ->paginate(15);
            
        return response()->json([
            'success' => true,
            'data' => $events
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'department_id' => 'nullable|exists:departments,id',
            'created_by' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:community,training,meeting,announcement,other',
            'location' => 'nullable|string|max:255',
            'start_datetime' => 'required|date',
            'end_datetime' => 'nullable|date|after:start_datetime',
            'target_audience' => 'in:public,staff,department,all',
            'is_published' => 'boolean',
            'image' => 'nullable|string',
        ]);

        $validated['target_audience'] = $validated['target_audience'] ?? 'public';
        $validated['is_published'] = $validated['is_published'] ?? false;

        $event = Event::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Event created successfully',
            'data' => $event
        ], 201);
    }

    public function show(Event $event): JsonResponse
    {
        $event->load(['department', 'createdBy']);
        return response()->json([
            'success' => true,
            'data' => $event
        ]);
    }

    public function update(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'department_id' => 'nullable|exists:departments,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|in:community,training,meeting,announcement,other',
            'location' => 'nullable|string|max:255',
            'start_datetime' => 'sometimes|required|date',
            'end_datetime' => 'nullable|date',
            'target_audience' => 'in:public,staff,department,all',
            'is_published' => 'boolean',
            'image' => 'nullable|string',
        ]);

        $event->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Event updated successfully',
            'data' => $event
        ]);
    }

    public function destroy(Event $event): JsonResponse
    {
        $event->delete();

        return response()->json([
            'success' => true,
            'message' => 'Event deleted successfully'
        ]);
    }
}