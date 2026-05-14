<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaitlistEntry extends Model
{
    protected $table = 'waitlist';

    protected $fillable = [
        'user_id', 'schedule_id', 'date', 'status',
        'expires_at', 'confirmed_at', 'notified_at',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'expires_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'notified_at' => 'datetime',
        ];
    }
}
