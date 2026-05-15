<?php

namespace App\Models;

use App\Models\CustomerSubscription;
use App\Models\PaymentTransaction;
use App\Models\PointCardPurchase;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable([
    'email',
    'password',
    'first_name',
    'last_name',
    'phone',
    'role',
    'stripe_customer_id',
    'email_verified_at',
    'last_login_at',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes, HasApiTokens;

    public function subscriptions(): HasMany
    {
        return $this->hasMany(CustomerSubscription::class);
    }

    public function pointCardPurchases(): HasMany
    {
        return $this->hasMany(PointCardPurchase::class);
    }

    public function paymentTransactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
