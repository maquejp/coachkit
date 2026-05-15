<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class BookingReminderMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $date,
        public string $time,
        public string $location,
        public string $instructor,
        public string $className,
    ) {}

    public function build(): static
    {
        return $this->subject("Reminder: {$this->className} tomorrow")
            ->view('emails.booking-reminder');
    }
}
