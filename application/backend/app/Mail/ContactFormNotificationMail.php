<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactFormNotificationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $name,
        public string $email,
        public string $body,
        public ?string $phone,
    ) {}

    public function build(): static
    {
        return $this->subject('New Contact Form Submission')
            ->view('emails.contact-form-notification');
    }
}
