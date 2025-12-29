<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::all();
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:50',
            'status' => 'nullable|string|in:planned,in_progress,on_hold,completed,cancelled',
            'budget' => 'nullable|numeric',
            'spent' => 'nullable|numeric',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'progress_percentage' => 'nullable|integer|min:0|max:100',
        ]);

        $validated['status'] = $validated['status'] ?? 'planned';
        $validated['progress_percentage'] = $validated['progress_percentage'] ?? 0;
        $validated['spent'] = $validated['spent'] ?? 0;

        // Auto-set progress based on status
        if ($validated['status'] === 'completed') {
            $validated['progress_percentage'] = 100;
        } elseif ($validated['status'] === 'planned') {
            $validated['progress_percentage'] = 0;
        }

        $project = Project::create($validated);
        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|max:50',
            'status' => 'nullable|string|in:planned,in_progress,on_hold,completed,cancelled',
            'budget' => 'nullable|numeric',
            'spent' => 'nullable|numeric',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'progress_percentage' => 'nullable|integer|min:0|max:100',
        ]);

        // Auto-set progress based on status
        if (isset($validated['status'])) {
            if ($validated['status'] === 'completed') {
                $validated['progress_percentage'] = 100;
            } elseif ($validated['status'] === 'planned') {
                $validated['progress_percentage'] = 0;
            }
        }

        $project->update($validated);
        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(null, 204);
    }
}