<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentReceiptMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public float $amount,
        public string $currency,
        public string $description,
        public string $receiptUrl,
        public string $date,
    ) {}

    public function build(): static
    {
        return $this->subject("Payment Receipt - {$this->description}")
            ->view('emails.payment-receipt');
    }
}
