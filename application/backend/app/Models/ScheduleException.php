<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleException extends Model
{
    protected $fillable = [
        'location_id', 'date', 'is_closed',
        'open_time', 'close_time', 'reason',
    ];

    protected function casts(): array
    {
        return [
            'is_closed' => 'boolean',
            'open_time' => 'datetime:H:i',
            'close_time' => 'datetime:H:i',
        ];
    }
}
