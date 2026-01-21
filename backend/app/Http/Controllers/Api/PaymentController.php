<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Citizen;
use App\Notifications\PaymentNotification;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('citizen')->get();
        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'citizen_id' => 'nullable|integer',
            'type' => 'required|string|max:50',
            'description' => 'nullable|string',
            'amount' => 'required|numeric',
            'status' => 'nullable|string|in:pending,completed,failed,refunded',
            'payment_method' => 'nullable|string|in:cash,card,online,bank_transfer',
            'due_date' => 'nullable|date',
        ]);

        $validated['status'] = $validated['status'] ?? 'pending';
        
        // Generate unique reference number
        $lastId = Payment::max('id') ?? 0;
        $validated['reference_number'] = 'PAY-' . date('Y') . '-' . str_pad($lastId + 1, 4, '0', STR_PAD_LEFT) . '-' . substr(time(), -4);

        $payment = Payment::create($validated);

        // Send notification to citizen when bill is created
        if ($payment->citizen_id) {
            $citizen = Citizen::with('user')->find($payment->citizen_id);
            if ($citizen && $citizen->user) {
                $citizen->user->notify(new PaymentNotification($payment, 'reminder'));
            }
        }

        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        $payment->load('citizen');
        return response()->json($payment);
    }

    public function update(Request $request, Payment $payment)
    {
        $oldStatus = $payment->status;

        $validated = $request->validate([
            'citizen_id' => 'nullable|integer',
            'type' => 'sometimes|string|max:50',
            'description' => 'nullable|string',
            'amount' => 'sometimes|numeric',
            'status' => 'nullable|string|in:pending,completed,failed,refunded',
            'payment_method' => 'nullable|string|in:cash,card,online,bank_transfer',
            'due_date' => 'nullable|date',
        ]);

        if ($request->status === 'completed' && !$payment->payment_date) {
            $validated['payment_date'] = now();
            $validated['receipt_number'] = 'RCP-' . date('Y') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        }

        $payment->update($validated);

        // Send notification if status changed
        if ($request->has('status') && $oldStatus !== $payment->status) {
            if ($payment->citizen_id) {
                $citizen = Citizen::with('user')->find($payment->citizen_id);
                if ($citizen && $citizen->user) {
                    if ($payment->status === 'completed') {
                        $citizen->user->notify(new PaymentNotification($payment, 'receipt'));
                    } else {
                        $citizen->user->notify(new PaymentNotification($payment, 'status'));
                    }
                }
            }
        }

        return response()->json($payment);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(null, 204);
    }
}