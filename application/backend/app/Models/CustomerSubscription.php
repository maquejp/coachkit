<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerSubscription extends Model
{
    protected $table = 'customer_subscriptions';

    protected $fillable = [
        'user_id', 'subscription_plan_id', 'start_date', 'end_date',
        'sessions_used', 'status', 'stripe_subscription_id',
        'auto_renew', 'notes', 'cancelled_at',
    ];

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

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
