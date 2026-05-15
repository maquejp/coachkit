<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Mail\AccountActivationMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required|string",
        ]);

        $user = User::where("email", $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                "success" => false,
                "error" => "Invalid credentials",
            ], 401);
        }

        $token = $user->createToken("api")->plainTextToken;

        return response()->json([
            "success" => true,
            "data" => [
                "user" => new UserResource($user),
                "token" => $token,
            ],
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $request->validate([
            "firstName" => "required|string|max:255",
            "lastName" => "required|string|max:255",
            "email" => "required|email|unique:users,email",
            "password" => "required|string|min:8",
            "phone" => "nullable|string|max:50",
        ]);

        $user = User::query()->create([
            "first_name" => $request->firstName,
            "last_name" => $request->lastName,
            "email" => $request->email,
            "password" => Hash::make($request->password),
            "phone" => $request->phone,
            "role" => "customer",
        ]);

        $token = $user->createToken("api")->plainTextToken;

        Mail::to($user->email)->queue(new AccountActivationMail(
            userName: $user->first_name,
            email: $user->email,
            activationUrl: config('app.frontend_url') . '/auth/activate?token=' . $token,
        ));

        return response()->json([
            "success" => true,
            "data" => [
                "user" => new UserResource($user),
                "token" => $token,
            ],
        ], 201);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            "success" => true,
            "data" => new UserResource($request->user()),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            "success" => true,
            "data" => null,
        ]);
    }
}
