<?php

namespace App\Console\Commands;

use App\Mail\BookingReminderMail;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendBookingReminders extends Command
{
    protected $signature = 'bookings:send-reminders';
    protected $description = 'Send booking reminders for tomorrow\'s classes';

    public function handle(): int
    {
        $tomorrow = Carbon::tomorrow()->toDateString();

        $bookings = Booking::query()
            ->whereDate('booking_date', $tomorrow)
            ->with(['user', 'schedule.classType', 'schedule.location', 'schedule.coach'])
            ->get();

        $sent = 0;
        foreach ($bookings as $booking) {
            $user = $booking->user;
            $schedule = $booking->schedule;

            Mail::to($user->email)->queue(new BookingReminderMail(
                userName: $user->first_name,
                date: $booking->booking_date,
                time: $schedule->start_time,
                location: $schedule->location?->name ?? 'TBD',
                instructor: $schedule->coach?->first_name ?? 'TBD',
                className: $schedule->classType?->name ?? 'Class',
            ));
            $sent++;
        }

        $this->info("Sent {$sent} booking reminders for {$tomorrow}.");

        return self::SUCCESS;
    }
}
