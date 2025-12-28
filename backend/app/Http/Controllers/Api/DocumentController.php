<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(): JsonResponse
    {
        $documents = Document::with('uploadedBy')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return response()->json([
            'success' => true,
            'data' => $documents
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'uploaded_by' => 'nullable|exists:users,id',
            'title' => 'required|string|max:255',
            'file' => 'required|file|max:10240',
            'documentable_type' => 'required|string',
            'documentable_id' => 'required|integer',
            'description' => 'nullable|string',
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');

        $document = Document::create([
            'uploaded_by' => $validated['uploaded_by'],
            'title' => $validated['title'],
            'file_path' => $path,
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
            'documentable_type' => $validated['documentable_type'],
            'documentable_id' => $validated['documentable_id'],
            'description' => $validated['description'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Document uploaded successfully',
            'data' => $document
        ], 201);
    }

    public function show(Document $document): JsonResponse
    {
        $document->load('uploadedBy');
        return response()->json([
            'success' => true,
            'data' => $document
        ]);
    }

    public function update(Request $request, Document $document): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $document->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Document updated successfully',
            'data' => $document
        ]);
    }

    public function destroy(Document $document): JsonResponse
    {
        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return response()->json([
            'success' => true,
            'message' => 'Document deleted successfully'
        ]);
    }
}