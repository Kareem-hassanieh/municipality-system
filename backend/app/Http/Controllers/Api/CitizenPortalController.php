<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Citizen;
use App\Models\User;
use App\Models\Request as ServiceRequest;
use App\Models\Permit;
use App\Models\Payment;
use App\Models\Event;
use App\Models\Project;
use App\Notifications\RequestStatusNotification;
use App\Notifications\PermitStatusNotification;
use App\Notifications\PaymentNotification;
use App\Notifications\AdminPaymentNotification;
use Illuminate\Http\Request;

class CitizenPortalController extends Controller
{
    private function getCitizen(Request $request)
    {
        return Citizen::where('user_id', $request->user()->id)->first();
    }

    private function getOrCreateCitizen(Request $request)
    {
        $citizen = $this->getCitizen($request);
        
        if (!$citizen) {
            $user = $request->user();
            $citizen = Citizen::create([
                'user_id' => $user->id,
                'national_id' => 'CIT-' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
                'first_name' => explode(' ', $user->name)[0],
                'last_name' => explode(' ', $user->name)[1] ?? '',
                'date_of_birth' => now()->subYears(25)->format('Y-m-d'),
                'gender' => 'male',
                'address' => 'Not provided',
                'city' => 'Not provided',
                'is_verified' => false,
            ]);
        }

        return $citizen;
    }

    public function profile(Request $request)
    {
        $citizen = $this->getOrCreateCitizen($request);

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

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'gender' => 'nullable|string|in:male,female',
            'date_of_birth' => 'nullable|date',
        ]);

        $updateData = [];
        foreach ($validated as $key => $value) {
            if ($request->has($key)) {
                $updateData[$key] = $value;
            }
        }

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
        $citizen = $this->getOrCreateCitizen($request);

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

        // Send notification to citizen
        $request->user()->notify(new RequestStatusNotification($serviceRequest));

        // Notify admins about new request
        $admins = User::whereIn('role', ['admin', 'clerk'])->get();
        foreach ($admins as $admin) {
            $admin->notify(new RequestStatusNotification($serviceRequest));
        }

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
        $citizen = $this->getOrCreateCitizen($request);

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

        // Send notification to citizen
        $request->user()->notify(new PermitStatusNotification($permit));

        // Notify admins about new permit application
        $admins = User::whereIn('role', ['admin', 'urban_planner'])->get();
        foreach ($admins as $admin) {
            $admin->notify(new PermitStatusNotification($permit));
        }

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

        // Check if already paid
        if ($payment->status === 'completed') {
            return response()->json(['message' => 'This bill has already been paid'], 400);
        }

        $payment->update([
            'status' => 'completed',
            'payment_date' => now(),
            'payment_method' => $request->payment_method ?? 'card',
            'receipt_number' => 'RCP-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT),
        ]);

        // Send receipt notification to citizen
        $request->user()->notify(new PaymentNotification($payment, 'receipt'));

        // Notify admins about the payment
        $admins = User::whereIn('role', ['admin', 'finance_officer'])->get();
        foreach ($admins as $admin) {
            $admin->notify(new AdminPaymentNotification($payment, $citizen));
        }

        return response()->json($payment);
    }

    public function events(Request $request)
    {
        // Get all published events, ordered by start date
        $events = Event::where('is_published', true)
            ->where('start_datetime', '>=', now())
            ->with('department:id,name')
            ->orderBy('start_datetime', 'asc')
            ->get();

        return response()->json($events);
    }

    public function projects(Request $request)
    {
        // Get all active/in-progress projects for public view
        $projects = Project::whereIn('status', ['planning', 'in_progress', 'on_hold'])
            ->with('department:id,name')
            ->orderBy('start_date', 'desc')
            ->get();

        return response()->json($projects);
    }
}