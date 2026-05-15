<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PointCardPlan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'description', 'sessions_count', 'price_cents',
        'validity_days', 'is_active', 'stripe_price_id',
    ];
}
