<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CancellationConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $date,
        public string $time,
        public string $className,
    ) {}

    public function build(): static
    {
        return $this->subject("Booking Cancelled - {$this->className}")
            ->view('emails.cancellation-confirmation');
    }
}
