<?php

namespace Database\Seeders;

use App\Models\PaymentTransaction;
use App\Models\User;
use App\Models\CustomerSubscription;
use App\Models\PointCardPurchase;
use App\Models\Booking;
use Illuminate\Database\Seeder;

class PaymentTransactionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('role', 'customer')->get();
        $subscriptions = CustomerSubscription::all();
        $purchases = PointCardPurchase::all();
        $bookings = Booking::where('status', 'confirmed')->take(3)->get();

        $transactions = [
            ['user_idx' => 0, 'amount' => 9900, 'status' => 'succeeded', 'desc' => 'Monthly Unlimited'],
            ['user_idx' => 1, 'amount' => 89900, 'status' => 'succeeded', 'desc' => 'Annual Unlimited'],
            ['user_idx' => 2, 'amount' => 9900, 'status' => 'succeeded', 'desc' => 'Monthly Unlimited'],
            ['user_idx' => 7, 'amount' => 16000, 'status' => 'succeeded', 'desc' => '10-Class Pack'],
            ['user_idx' => 8, 'amount' => 9000, 'status' => 'succeeded', 'desc' => '5-Class Pack'],
            ['user_idx' => 3, 'amount' => 2000, 'status' => 'succeeded', 'desc' => 'Drop-In Session'],
        ];

        foreach ($transactions as $i => $t) {
            if (!isset($users[$t['user_idx']])) continue;

            PaymentTransaction::query()->updateOrCreate(
                [
                    'user_id' => $users[$t['user_idx']]->id,
                    'description' => $t['desc'],
                    'amount_cents' => $t['amount'],
                ],
                [
                    'fee_cents' => (int) round($t['amount'] * 0.029 + 30),
                    'net_cents' => $t['amount'] - (int) round($t['amount'] * 0.029 + 30),
                    'currency' => 'EUR',
                    'status' => $t['status'],
                    'payment_method' => 'card',
                ],
            );
        }
    }
}
