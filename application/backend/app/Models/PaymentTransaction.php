<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentTransaction extends Model
{
    protected $table = 'payment_transactions';

    protected $fillable = [
        'user_id', 'subscription_id', 'point_card_purchase_id',
        'booking_id', 'amount_cents', 'fee_cents', 'net_cents',
        'currency', 'status', 'payment_method',
        'stripe_payment_intent_id', 'paypal_order_id', 'paypal_capture_id',
        'receipt_url', 'description', 'metadata',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(CustomerSubscription::class, 'subscription_id');
    }

    public function pointCardPurchase(): BelongsTo
    {
        return $this->belongsTo(PointCardPurchase::class, 'point_card_purchase_id');
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }
}
