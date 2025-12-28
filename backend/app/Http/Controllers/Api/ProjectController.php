<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        $projects = Project::with(['department', 'manager'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'department_id' => 'nullable|exists:departments,id',
            'manager_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:road,park,building,infrastructure,maintenance,other',
            'status' => 'in:planned,in_progress,on_hold,completed,cancelled',
            'budget' => 'numeric|min:0',
            'spent' => 'numeric|min:0',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'progress_percentage' => 'integer|min:0|max:100',
        ]);

        $validated['status'] = $validated['status'] ?? 'planned';
        $validated['budget'] = $validated['budget'] ?? 0;
        $validated['spent'] = $validated['spent'] ?? 0;
        $validated['progress_percentage'] = $validated['progress_percentage'] ?? 0;

        $project = Project::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        $project->load(['department', 'manager', 'tasks', 'documents']);
        return response()->json([
            'success' => true,
            'data' => $project
        ]);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'department_id' => 'nullable|exists:departments,id',
            'manager_id' => 'nullable|exists:users,id',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|required|in:road,park,building,infrastructure,maintenance,other',
            'status' => 'in:planned,in_progress,on_hold,completed,cancelled',
            'budget' => 'numeric|min:0',
            'spent' => 'numeric|min:0',
            'location' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'progress_percentage' => 'integer|min:0|max:100',
        ]);

        $project->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully'
        ]);
    }
}