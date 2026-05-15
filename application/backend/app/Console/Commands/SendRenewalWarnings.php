<?php

namespace App\Console\Commands;

use App\Mail\SubscriptionRenewingMail;
use App\Models\CustomerSubscription;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendRenewalWarnings extends Command
{
    protected $signature = 'subscriptions:renewal-warnings';
    protected $description = 'Send renewal warnings for subscriptions expiring in 7 days';

    public function handle(): int
    {
        $targetDate = Carbon::now()->addDays(7)->toDateString();

        $subscriptions = CustomerSubscription::query()
            ->whereDate('end_date', $targetDate)
            ->where('status', 'active')
            ->where('auto_renew', true)
            ->with(['user', 'plan'])
            ->get();

        $sent = 0;
        foreach ($subscriptions as $subscription) {
            $user = $subscription->user;
            $plan = $subscription->plan;

            $amount = $plan ? '€' . number_format($plan->price_cents / 100, 2) : '€0.00';

            Mail::to($user->email)->queue(new SubscriptionRenewingMail(
                userName: $user->first_name,
                planName: $plan?->name ?? 'Unknown',
                renewalDate: $subscription->end_date,
                amount: $amount,
            ));
            $sent++;
        }

        $this->info("Sent {$sent} renewal warnings for {$targetDate}.");

        return self::SUCCESS;
    }
}
