<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::all();
        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:50',
            'description' => 'nullable|string',
            'amount' => 'required|numeric',
            'status' => 'nullable|string|in:pending,completed,failed,refunded',
            'payment_method' => 'nullable|string|in:cash,card,online,bank_transfer',
            'due_date' => 'nullable|date',
        ]);

        $validated['status'] = $validated['status'] ?? 'pending';
        $validated['reference_number'] = 'PAY-' . date('Y') . '-' . str_pad(Payment::count() + 1, 4, '0', STR_PAD_LEFT);

        $payment = Payment::create($validated);
        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        return response()->json($payment);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
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
        return response()->json($payment);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->json(null, 204);
    }
}