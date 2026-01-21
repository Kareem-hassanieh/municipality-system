<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'citizen_id',
        'type',
        'reference_number',
        'description',
        'amount',
        'status',
        'payment_method',
        'due_date',
        'payment_date',
        'receipt_number',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'date',
        'payment_date' => 'date',
    ];

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }
}