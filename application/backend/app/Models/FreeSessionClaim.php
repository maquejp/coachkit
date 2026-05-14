<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FreeSessionClaim extends Model
{
    protected $table = 'free_session_claims';

    protected $fillable = [
        'email', 'user_id', 'booking_id', 'claimed_at',
    ];

    protected function casts(): array
    {
        return [
            'claimed_at' => 'datetime',
        ];
    }
}
