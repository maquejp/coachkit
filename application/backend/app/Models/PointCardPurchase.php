<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointCardPurchase extends Model
{
    protected $fillable = [
        'user_id', 'point_card_plan_id', 'sessions_remaining',
        'purchase_date', 'expiry_date',
    ];

    protected function casts(): array
    {
        return [
            'purchase_date' => 'date',
            'expiry_date' => 'date',
        ];
    }
}
