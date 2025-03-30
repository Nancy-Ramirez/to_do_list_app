<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['title', 'description', 'deadline', 'completed'];
    protected $casts = [
        'deadline' => 'date:Y-m-d',
        'completed' => 'boolean',
    ];
}