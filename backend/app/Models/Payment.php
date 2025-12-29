<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
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
}