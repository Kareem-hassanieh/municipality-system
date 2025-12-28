<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permit extends Model
{
    use HasFactory;

    protected $fillable = [
        'citizen_id',
        'department_id',
        'reviewed_by',
        'type',
        'title',
        'description',
        'status',
        'application_date',
        'issue_date',
        'expiry_date',
        'fee',
        'is_paid',
        'rejection_reason',
    ];

    protected $casts = [
        'application_date' => 'date',
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'fee' => 'decimal:2',
        'is_paid' => 'boolean',
    ];

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}