<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::all();
        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'start_datetime' => 'nullable|date',
            'end_datetime' => 'nullable|date',
            'target_audience' => 'nullable|string|in:public,staff,department',
            'is_published' => 'nullable',
        ]);

        $validated['target_audience'] = $validated['target_audience'] ?? 'public';
        $validated['is_published'] = filter_var($request->is_published ?? true, FILTER_VALIDATE_BOOLEAN);

        $event = Event::create($validated);
        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'start_datetime' => 'nullable|date',
            'end_datetime' => 'nullable|date',
            'target_audience' => 'nullable|string|in:public,staff,department',
            'is_published' => 'nullable',
        ]);

        if ($request->has('is_published')) {
            $validated['is_published'] = filter_var($request->is_published, FILTER_VALIDATE_BOOLEAN);
        }

        $event->update($validated);
        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(null, 204);
    }
}