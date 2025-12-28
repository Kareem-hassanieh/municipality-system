<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'uploaded_by',
        'title',
        'file_path',
        'file_type',
        'file_size',
        'documentable_type',
        'documentable_id',
        'description',
    ];

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function documentable()
    {
        return $this->morphTo();
    }
}