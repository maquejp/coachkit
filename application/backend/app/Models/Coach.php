<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Coach extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'first_name', 'last_name', 'bio', 'photo_url',
        'email', 'phone', 'is_active',
    ];
}
