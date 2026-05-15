<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\FreeSessionClaim;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class GuestController extends Controller
{
    public function checkClaim(Request $request): JsonResponse
    {
        $request->validate(["email" => "required|email"]);

        $claim = FreeSessionClaim::where("email", $request->email)->first();

        return response()->json([
            "success" => true,
            "data" => [
                "claimed" => $claim !== null,
                "claim" => $claim ? [
                    "id" => (string) $claim->id,
                    "email" => $claim->email,
                    "userId" => $claim->user_id ? (string) $claim->user_id : null,
                    "bookingId" => (string) $claim->booking_id,
                    "claimedAt" => $claim->claimed_at->toISOString(),
                    "activatedAt" => $claim->user_id ? $claim->created_at->toISOString() : null,
                ] : null,
            ],
        ]);
    }

    public function createClaim(Request $request): JsonResponse
    {
        $request->validate([
            "email" => "required|email",
            "bookingId" => "required|integer|exists:bookings,id",
        ]);

        $existing = FreeSessionClaim::where("email", $request->email)->first();

        if ($existing) {
            return response()->json([
                "success" => false,
                "error" => "Email already claimed a free session",
            ], 409);
        }

        $claim = FreeSessionClaim::query()->create([
            "email" => $request->email,
            "booking_id" => $request->bookingId,
            "claimed_at" => now(),
        ]);

        return response()->json([
            "success" => true,
            "data" => [
                "id" => (string) $claim->id,
                "email" => $claim->email,
                "userId" => null,
                "bookingId" => (string) $claim->booking_id,
                "claimedAt" => $claim->claimed_at->toISOString(),
                "activatedAt" => null,
            ],
        ], 201);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required|string|min:8",
            "firstName" => "required|string|max:255",
            "lastName" => "required|string|max:255",
            "claimId" => "required|integer|exists:free_session_claims,id",
        ]);

        $claim = FreeSessionClaim::findOrFail($request->claimId);

        if ($claim->email !== $request->email) {
            return response()->json([
                "success" => false,
                "error" => "Email does not match claim",
            ], 400);
        }

        if ($claim->user_id !== null) {
            return response()->json([
                "success" => false,
                "error" => "Claim already activated",
            ], 409);
        }

        $user = User::query()->create([
            "first_name" => $request->firstName,
            "last_name" => $request->lastName,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "role" => "customer",
        ]);

        $claim->update(["user_id" => $user->id]);

        $token = $user->createToken("api")->plainTextToken;

        return response()->json([
            "success" => true,
            "data" => [
                "user" => new UserResource($user),
                "token" => $token,
            ],
        ], 201);
    }
}
