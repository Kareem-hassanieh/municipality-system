<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function index(): JsonResponse
    {
        $payments = Payment::with('citizen')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
            
        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'citizen_id' => 'required|exists:citizens,id',
            'type' => 'required|in:property_tax,water_bill,electricity_bill,waste_fee,permit_fee,other',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'status' => 'in:pending,completed,failed,refunded',
            'payment_method' => 'nullable|in:cash,card,bank_transfer,online',
            'due_date' => 'nullable|date',
            'payment_date' => 'nullable|date',
        ]);

        $validated['reference_number'] = 'PAY-' . strtoupper(Str::random(10));
        $validated['status'] = $validated['status'] ?? 'pending';

        $payment = Payment::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Payment created successfully',
            'data' => $payment
        ], 201);
    }

    public function show(Payment $payment): JsonResponse
    {
        $payment->load('citizen');
        return response()->json([
            'success' => true,
            'data' => $payment
        ]);
    }

    public function update(Request $request, Payment $payment): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'sometimes|required|in:property_tax,water_bill,electricity_bill,waste_fee,permit_fee,other',
            'description' => 'nullable|string',
            'amount' => 'sometimes|required|numeric|min:0',
            'status' => 'in:pending,completed,failed,refunded',
            'payment_method' => 'nullable|in:cash,card,bank_transfer,online',
            'due_date' => 'nullable|date',
            'payment_date' => 'nullable|date',
            'receipt_number' => 'nullable|string',
        ]);

        if ($validated['status'] ?? null === 'completed' && !$payment->receipt_number) {
            $validated['receipt_number'] = 'RCP-' . strtoupper(Str::random(10));
            $validated['payment_date'] = $validated['payment_date'] ?? now();
        }

        $payment->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Payment updated successfully',
            'data' => $payment
        ]);
    }

    public function destroy(Payment $payment): JsonResponse
    {
        $payment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Payment deleted successfully'
        ]);
    }
}