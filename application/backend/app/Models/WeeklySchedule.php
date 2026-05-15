<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class WeeklySchedule extends Model
{
    use SoftDeletes;

    protected $table = 'weekly_schedule';

    protected $fillable = [
        'class_type_id', 'coach_id', 'location_id', 'day_of_week',
        'start_time', 'end_time', 'max_capacity',
        'valid_from', 'valid_until', 'is_active',
    ];

    public function classType(): BelongsTo
    {
        return $this->belongsTo(ClassType::class, 'class_type_id');
    }

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime:H:i',
            'end_time' => 'datetime:H:i',
        ];
    }
}
