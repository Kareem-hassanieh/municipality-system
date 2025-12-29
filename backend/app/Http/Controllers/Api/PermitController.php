<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Permit;
use Illuminate\Http\Request;

class PermitController extends Controller
{
    public function index()
    {
        $permits = Permit::all();
        return response()->json($permits);
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

        if ($request->status === 'approved' && !$permit->issue_date) {
            $validated['issue_date'] = now();
        }

        $permit->update($validated);
        return response()->json($permit);
    }

    public function destroy(Permit $permit)
    {
        $permit->delete();
        return response()->json(null, 204);
    }
}