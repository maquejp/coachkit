<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassType extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'slug', 'description', 'color', 'intensity_level',
        'image_url', 'duration_minutes', 'max_capacity',
        'default_price_cents', 'sort_order', 'is_active',
    ];
}
