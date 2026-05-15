<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PointCardPurchase extends Model
{
    protected $fillable = [
        'user_id', 'point_card_plan_id', 'sessions_remaining',
        'purchase_date', 'expiry_date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(PointCardPlan::class, 'point_card_plan_id');
    }

    public function pointCardPlan(): BelongsTo
    {
        return $this->belongsTo(PointCardPlan::class, 'point_card_plan_id');
    }

    public function paymentTransactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class, 'point_card_purchase_id');
    }

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'expiry_date' => 'date',
        ];
    }
}
