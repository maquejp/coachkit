<?php

namespace Tests\Feature;

use App\Mail\AccountActivationMail;
use App\Mail\BookingConfirmationMail;
use App\Mail\BookingReminderMail;
use App\Mail\CancellationConfirmationMail;
use App\Mail\ContactFormNotificationMail;
use App\Mail\PaymentFailedMail;
use App\Mail\PaymentReceiptMail;
use App\Mail\SubscriptionConfirmationMail;
use App\Mail\SubscriptionRenewingMail;
use App\Mail\WaitlistPromotionMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MailTest extends TestCase
{
    use RefreshDatabase;

    public function test_booking_confirmation_mail(): void
    {
        Mail::fake();

        $mailable = new BookingConfirmationMail(
            userName: 'John',
            date: '2026-06-01',
            time: '10:00',
            location: 'Studio A',
            instructor: 'Sarah',
            className: 'Morning Yoga',
        );

        Mail::to('test@example.com')->queue($mailable);

        Mail::assertQueued(BookingConfirmationMail::class, function (BookingConfirmationMail $mail) {
            $mail->build();
            return $mail->hasTo('test@example.com')
                && str_contains($mail->subject, 'Booking Confirmation');
        });

        $rendered = $mailable->render();
        $this->assertStringContainsString('Morning Yoga', $rendered);
    }

    public function test_booking_reminder_mail(): void
    {
        Mail::fake();

        $mailable = new BookingReminderMail(
            userName: 'John',
            date: '2026-06-01',
            time: '10:00',
            location: 'Studio A',
            instructor: 'Sarah',
            className: 'Morning Yoga',
        );

        Mail::to('test@example.com')->queue($mailable);

        Mail::assertQueued(BookingReminderMail::class, function (BookingReminderMail $mail) {
            $mail->build();
            return $mail->hasTo('test@example.com')
                && str_contains($mail->subject, 'Reminder');
        });

        $rendered = $mailable->render();
        $this->assertStringContainsString('Morning Yoga', $rendered);
    }

    public function test_cancellation_confirmation_mail(): void
    {
        Mail::fake();

        $mailable = new CancellationConfirmationMail(
            userName: 'John',
            date: '2026-06-01',
            time: '10:00',
            className: 'Morning Yoga',
        );

        Mail::to('test@example.com')->queue($mailable);

        Mail::assertQueued(CancellationConfirmationMail::class, function (CancellationConfirmationMail $mail) {
            $mail->build();
            return $mail->hasTo('test@example.com')
                && str_contains($mail->subject, 'Booking Cancelled');
        });

        $rendered = $mailable->render();
        $this->assertStringContainsString('Morning Yoga', $rendered);
    }

    public function test_waitlist_promotion_mail(): void
    {
        Mail::fake();

        $mailable = new WaitlistPromotionMail(
            userName: 'John',
            className: 'Morning Yoga',
            date: '2026-06-01',
            time: '10:00',
            claimExpiryHours: 24,
        );

        Mail::to('test@example.com')->queue($mailable);

        Mail::assertQueued(WaitlistPromotionMail::class, function (WaitlistPromotionMail $mail) {
            $mail->build();
            return $mail->hasTo('test@example.com')
                && str_contains($mail->subject, 'Spot Available');
        });

        $rendered = $mailable->render();
        $this->assertStringContainsString('Morning Yoga', $rendered);
    }

    public function test_subscription_confirmation_mail(): void
    {
        Mail::fake();

        $mailable = new SubscriptionConfirmationMail(
            userName: 'John',
            planName: 'Monthly Unlimited',
            startDate: '2026-06-01',
            endDate: '2026-07-01',
            amount: '€99.00',
        );

        Mail::to('test@example.com')->queue($mailable);

        Mail::assertQueued(SubscriptionConfirmationMail::class, function (SubscriptionConfirmationMail $mail) {
            $mail->build();
            return $mail->hasTo('test@example.com')
                && str_contains($mail->subject, 'Subscription Confirmed');
        });

        $rendered = $mailable->render();
        $this->assertStringContainsString('Monthly Unlimited', $rendered);
    }

    public function test_payment_receipt_mail(): void
    {
        Mail::fake();

        $mailable = new PaymentReceiptMail(
            userName: 'John',
            amount: 9900,
            currency: 'EUR',
            description: 'Monthly Unlimited',
            receiptUrl: 'https://stripe.com/receipt/123',
            date: '2026-06-01',
        );

        Mail::to('test@example.com')->queue($mailable);

        Mail::assertQueued(PaymentReceiptMail::class, function (PaymentReceiptMail $mail) {
            $mail->build();
            return $mail->hasTo('test@example.com')
                && str_contains($mail->subject, 'Payment Receipt');
        });

        $rendered = $mailable->render();
        $this->assertStringContainsString('Monthly Unlimited', $rendered);
    }

    public function test_payment_failed_mail(): void
    {
        Mail::fake();

        $mailable = new PaymentFailedMail(
            userName: 'John',
            amount: 9900,
            currency: 'EUR',
            description: 'Monthly Unlimited',
            errorMessage: 'Card declined',
        );

        Mail::to('test@example.com')->queue($mailable);

        Mail::assertQueued(PaymentFailedMail::class, function (PaymentFailedMail $mail) {
            $mail->build();
            return $mail->hasTo('test@example.com')
                && str_contains($mail->subject, 'Payment Failed');
        });

        $rendered = $mailable->render();
        $this->assertStringContainsString('Monthly Unlimited', $rendered);
    }

    public function test_subscription_renewing_mail(): void
    {
        Mail::fake();

        $mailable = new SubscriptionRenewingMail(
            userName: 'John',
            planName: 'Monthly Unlimited',
            renewalDate: '2026-07-01',
            amount: '€99.00',
        );

        Mail::to('test@example.com')->queue($mailable);

        Mail::assertQueued(SubscriptionRenewingMail::class, function (SubscriptionRenewingMail $mail) {
            $mail->build();
            return $mail->hasTo('test@example.com')
                && str_contains($mail->subject, 'Subscription is Renewing');
        });

        $rendered = $mailable->render();
        $this->assertStringContainsString('Monthly Unlimited', $rendered);
    }

    public function test_contact_form_notification_mail(): void
    {
        Mail::fake();

        $mailable = new ContactFormNotificationMail(
            name: 'Jane Doe',
            email: 'jane@example.com',
            body: 'I have a question about classes',
            phone: '+1234567890',
        );

        Mail::to('test@example.com')->queue($mailable);

        Mail::assertQueued(ContactFormNotificationMail::class, function (ContactFormNotificationMail $mail) {
            $mail->build();
            return $mail->hasTo('test@example.com')
                && str_contains($mail->subject, 'Contact Form');
        });

        $rendered = $mailable->render();
        $this->assertStringContainsString('Jane Doe', $rendered);
    }

    public function test_account_activation_mail(): void
    {
        Mail::fake();

        $mailable = new AccountActivationMail(
            userName: 'John',
            email: 'john@example.com',
            activationUrl: 'http://localhost:5173/auth/activate?token=abc123',
        );

        Mail::to('test@example.com')->queue($mailable);

        Mail::assertQueued(AccountActivationMail::class, function (AccountActivationMail $mail) {
            $mail->build();
            return $mail->hasTo('test@example.com')
                && str_contains($mail->subject, 'Activate Your Account');
        });

        $rendered = $mailable->render();
        $this->assertStringContainsString('john@example.com', $rendered);
    }
}
