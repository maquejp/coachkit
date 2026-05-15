<?php

namespace App\Models;

use Database\Factories\FreeSessionClaimFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreeSessionClaim extends Model
{
    /** @use HasFactory<FreeSessionClaimFactory> */
    use HasFactory;

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
