<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Location extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'address', 'city', 'postal_code',
        'phone', 'email', 'google_maps_url', 'notes', 'is_active',
    ];
}
