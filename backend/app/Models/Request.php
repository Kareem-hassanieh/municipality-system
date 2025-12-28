<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $fillable = [
        'citizen_id',
        'department_id',
        'assigned_to',
        'type',
        'subject',
        'description',
        'status',
        'priority',
        'admin_notes',
        'submission_date',
        'completion_date',
    ];

    protected $casts = [
        'submission_date' => 'date',
        'completion_date' => 'date',
    ];

    public function citizen()
    {
        return $this->belongsTo(Citizen::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}