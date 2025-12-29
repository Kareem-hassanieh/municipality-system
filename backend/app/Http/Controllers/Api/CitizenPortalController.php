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
        
        if (!$citizen) {
            return response()->json(['message' => 'Citizen profile not found'], 404);
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

    $validated = [];

    if ($request->has('first_name') && $request->first_name) {
        $validated['first_name'] = $request->first_name;
    }
    if ($request->has('last_name')) {
        $validated['last_name'] = $request->last_name;
    }
    if ($request->has('phone')) {
        $validated['phone'] = $request->phone;
    }
    if ($request->has('address')) {
        $validated['address'] = $request->address;
    }
    if ($request->has('city')) {
        $validated['city'] = $request->city;
    }
    if ($request->has('date_of_birth') && $request->date_of_birth) {
        $validated['date_of_birth'] = $request->date_of_birth;
    }

    if (!empty($validated)) {
        $citizen->update($validated);
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
        
        if (!$citizen) {
            return response()->json(['message' => 'Citizen profile not found'], 404);
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
        
        if (!$citizen) {
            return response()->json(['message' => 'Citizen profile not found'], 404);
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