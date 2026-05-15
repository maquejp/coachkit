<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WaitlistPromotionMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $className,
        public string $date,
        public string $time,
        public int $claimExpiryHours,
    ) {}

    public function build(): static
    {
        return $this->subject("Spot Available - {$this->className}")
            ->view('emails.waitlist-promotion');
    }
}
