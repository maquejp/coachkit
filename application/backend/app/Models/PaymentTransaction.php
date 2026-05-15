<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentTransaction extends Model
{
    protected $table = 'payment_transactions';

    protected $fillable = [
        'user_id', 'subscription_id', 'point_card_purchase_id',
        'booking_id', 'amount_cents', 'fee_cents', 'net_cents',
        'currency', 'status', 'payment_method',
        'stripe_payment_intent_id', 'receipt_url',
        'description', 'metadata',
    ];

    protected function casts(): array
    {
        return [
            'metadata' => 'array',
        ];
    }
}
