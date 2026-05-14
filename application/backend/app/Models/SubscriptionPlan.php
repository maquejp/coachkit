<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubscriptionPlan extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name', 'description', 'type', 'sessions_per_week', 'price_cents',
        'interval', 'commitment_months', 'insurance_fee_cents',
        'trial_days', 'is_active', 'stripe_price_id', 'features',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
