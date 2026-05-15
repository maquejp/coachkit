<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;

class PayPalService
{
    private string $baseUrl;
    private ?string $accessToken = null;

    public function __construct()
    {
        $this->baseUrl = config('services.paypal.mode') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    private function getAccessToken(): string
    {
        if ($this->accessToken) {
            return $this->accessToken;
        }

        $response = Http::withBasicAuth(
            config('services.paypal.client_id'),
            config('services.paypal.secret'),
        )->asForm()->post("{$this->baseUrl}/v1/oauth2/token", [
            'grant_type' => 'client_credentials',
        ]);

        $response->throw();

        $this->accessToken = $response->json('access_token');

        return $this->accessToken;
    }

    private function client(): \Illuminate\Http\Client\PendingRequest
    {
        return Http::withToken($this->getAccessToken())
            ->withHeader('Content-Type', 'application/json')
            ->acceptJson();
    }

    public function createOrder(int $amountCents, string $currency, string $description): array
    {
        $response = $this->client()->post("{$this->baseUrl}/v2/checkout/orders", [
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'amount' => [
                        'currency_code' => strtoupper($currency),
                        'value' => number_format($amountCents / 100, 2, '.', ''),
                    ],
                    'description' => $description,
                ],
            ],
        ]);

        $response->throw();

        return $response->json();
    }

    public function captureOrder(string $paypalOrderId): array
    {
        $response = $this->client()->post(
            "{$this->baseUrl}/v2/checkout/orders/{$paypalOrderId}/capture",
        );

        $response->throw();

        return $response->json();
    }

    public function showOrderDetails(string $paypalOrderId): array
    {
        $response = $this->client()->get(
            "{$this->baseUrl}/v2/checkout/orders/{$paypalOrderId}",
        );

        $response->throw();

        return $response->json();
    }

    public function verifyWebhookSignature(
        string $payload,
        array $headers,
    ): bool {
        $authAlgo = $headers['paypal-auth-algo'] ?? '';
        $certUrl = $headers['paypal-cert-url'] ?? '';
        $transmissionId = $headers['paypal-transmission-id'] ?? '';
        $transmissionSig = $headers['paypal-transmission-sig'] ?? '';
        $transmissionTime = $headers['paypal-transmission-time'] ?? '';

        if (!$transmissionSig) {
            return false;
        }

        try {
            $response = Http::withToken($this->getAccessToken())
                ->withHeader('Content-Type', 'application/json')
                ->acceptJson()
                ->post("{$this->baseUrl}/v1/notifications/verify-webhook-signature", [
                    'auth_algo' => $authAlgo,
                    'cert_url' => $certUrl,
                    'transmission_id' => $transmissionId,
                    'transmission_sig' => $transmissionSig,
                    'transmission_time' => $transmissionTime,
                    'webhook_id' => config('services.paypal.webhook_id'),
                    'webhook_event' => json_decode($payload, true),
                ]);

            $response->throw();

            return $response->json('verification_status') === 'SUCCESS';
        } catch (RequestException) {
            return false;
        }
    }
}
