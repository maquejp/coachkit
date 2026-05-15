<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AccountActivationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $email,
        public string $activationUrl,
    ) {}

    public function build(): static
    {
        return $this->subject('Activate Your Account - ' . config('app.name'))
            ->view('emails.account-activation');
    }
}
