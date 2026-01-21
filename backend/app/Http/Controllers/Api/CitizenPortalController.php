<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\Request as ServiceRequest;
use App\Models\Permit;
use App\Models\Payment;
use Illuminate\Http\Request;

class CitizenPortalController extends Controller
{
    private function getCitizen(Request $request)
    {
        return Citizen::where('user_id', $request->user()->id)->first();
    }

    public function profile(Request $request)
    {
        $citizen = $this->getCitizen($request);
        
        // Auto-create citizen profile if it doesn't exist
        if (!$citizen) {
            $user = $request->user();
            $citizen = Citizen::create([
                'user_id' => $user->id,
                'national_id' => 'CIT-' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
                'first_name' => explode(' ', $user->name)[0],
                'last_name' => explode(' ', $user->name)[1] ?? '',
                'date_of_birth' => now()->subYears(25)->format('Y-m-d'), // Default age 25
                'gender' => 'male', // Default gender
                'address' => 'Not provided',
                'city' => 'Not provided',
                'is_verified' => false,
            ]);
        }

        return response()->json([
            'citizen' => $citizen,
            'user' => $request->user()
        ]);
    }

    public function updateProfile(Request $request)
    {
        $citizen = $this->getCitizen($request);
        
        if (!$citizen) {
            return response()->json(['message' => 'Citizen profile not found'], 404);
        }

        // Validate all possible fields
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'gender' => 'nullable|string|in:male,female',
            'date_of_birth' => 'nullable|date',
        ]);

        // Only update fields that are present in the request
        $updateData = [];
        foreach ($validated as $key => $value) {
            if ($request->has($key)) {
                $updateData[$key] = $value;
            }
        }

        // Update the citizen record if there's data to update
        if (!empty($updateData)) {
            $citizen->update($updateData);
        }

        return response()->json([
            'citizen' => $citizen->fresh(),
            'user' => $request->user()
        ]);
    }

    public function requests(Request $request)
    {
        $citizen = $this->getCitizen($request);
        
        if (!$citizen) {
            return response()->json([]);
        }

        $requests = ServiceRequest::where('citizen_id', $citizen->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
    }

    public function createRequest(Request $request)
    {
        $citizen = $this->getCitizen($request);
        
        // Auto-create citizen profile if it doesn't exist
        if (!$citizen) {
            $user = $request->user();
            $citizen = Citizen::create([
                'user_id' => $user->id,
                'national_id' => 'CIT-' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
                'first_name' => explode(' ', $user->name)[0],
                'last_name' => explode(' ', $user->name)[1] ?? '',
                'date_of_birth' => now()->subYears(25)->format('Y-m-d'), // Default age 25
                'gender' => 'male', // Default gender
                'address' => 'Not provided',
                'city' => 'Not provided',
                'is_verified' => false,
            ]);
        }

        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $validated['citizen_id'] = $citizen->id;
        $validated['status'] = 'pending';
        $validated['priority'] = 'medium';
        $validated['submission_date'] = now();

        $serviceRequest = ServiceRequest::create($validated);

        return response()->json($serviceRequest, 201);
    }

    public function permits(Request $request)
    {
        $citizen = $this->getCitizen($request);
        
        if (!$citizen) {
            return response()->json([]);
        }

        $permits = Permit::where('citizen_id', $citizen->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($permits);
    }

    public function applyPermit(Request $request)
    {
        $citizen = $this->getCitizen($request);
        
        // Auto-create citizen profile if it doesn't exist
        if (!$citizen) {
            $user = $request->user();
            $citizen = Citizen::create([
                'user_id' => $user->id,
                'national_id' => 'CIT-' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
                'first_name' => explode(' ', $user->name)[0],
                'last_name' => explode(' ', $user->name)[1] ?? '',
                'date_of_birth' => now()->subYears(25)->format('Y-m-d'), // Default age 25
                'gender' => 'male', // Default gender
                'address' => 'Not provided',
                'city' => 'Not provided',
                'is_verified' => false,
            ]);
        }

        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $validated['citizen_id'] = $citizen->id;
        $validated['status'] = 'pending';
        $validated['application_date'] = now();
        $validated['is_paid'] = false;

        $permit = Permit::create($validated);

        return response()->json($permit, 201);
    }

    public function payments(Request $request)
    {
        $citizen = $this->getCitizen($request);
        
        if (!$citizen) {
            return response()->json([]);
        }

        $payments = Payment::where('citizen_id', $citizen->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($payments);
    }

    public function payBill(Request $request, Payment $payment)
    {
        $citizen = $this->getCitizen($request);
        
        if (!$citizen || $payment->citizen_id !== $citizen->id) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        $payment->update([
            'status' => 'completed',
            'payment_date' => now(),
            'payment_method' => $request->payment_method ?? 'card',
            'receipt_number' => 'RCP-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);

        return response()->json($payment);
    }
}