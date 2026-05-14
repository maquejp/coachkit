<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerSubscription extends Model
{
    protected $table = 'customer_subscriptions';

    protected $fillable = [
        'user_id', 'subscription_plan_id', 'start_date', 'end_date',
        'sessions_used', 'status', 'stripe_subscription_id',
        'auto_renew', 'notes', 'cancelled_at',
    ];

    protected function casts(): array
    {
        return [
            'auto_renew' => 'boolean',
            'cancelled_at' => 'datetime',
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }
}
