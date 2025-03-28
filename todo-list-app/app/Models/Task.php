<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'deadline',
        'completed',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'deadline' => 'date',
    ];
}