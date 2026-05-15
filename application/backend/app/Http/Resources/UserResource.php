<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => (string) $this->id,
            "email" => $this->email,
            "firstName" => $this->first_name,
            "lastName" => $this->last_name,
            "phone" => $this->phone,
            "role" => $this->role,
            "emailVerifiedAt" => $this->email_verified_at?->toISOString(),
            "lastLoginAt" => $this->last_login_at?->toISOString(),
            "createdAt" => $this->created_at?->toISOString(),
            "updatedAt" => $this->updated_at?->toISOString(),
        ];
    }
}
