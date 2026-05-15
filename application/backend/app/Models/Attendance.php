<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $table = 'attendance';

    protected $fillable = [
        'booking_id', 'user_id', 'class_type_id', 'attended_at',
        'marked_by', 'check_in_method', 'notes',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    protected function casts(): array
    {
        return [
            'attended_at' => 'datetime',
        ];
    }
}
