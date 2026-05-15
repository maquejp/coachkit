<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'user_id', 'schedule_id', 'booking_date', 'status',
        'guest_email', 'source', 'waitlist_promoted_from_id',
        'notes', 'cancelled_at',
    ];

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(WeeklySchedule::class, 'schedule_id');
    }

    protected function casts(): array
    {
        return [
            'booking_date' => 'date',
            'cancelled_at' => 'datetime',
        ];
    }
}
