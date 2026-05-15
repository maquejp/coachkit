<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubscriptionConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $planName,
        public string $startDate,
        public string $endDate,
        public string $amount,
    ) {}

    public function build(): static
    {
        return $this->subject("Subscription Confirmed - {$this->planName}")
            ->view('emails.subscription-confirmation');
    }
}
