<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubscriptionRenewingMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $planName,
        public string $renewalDate,
        public string $amount,
    ) {}

    public function build(): static
    {
        return $this->subject('Your Subscription is Renewing Soon')
            ->view('emails.subscription-renewing');
    }
}
