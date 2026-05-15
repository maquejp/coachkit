<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactFormNotificationMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function submit(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string',
            'phone' => 'nullable|string|max:50',
        ]);

        $adminEmail = config('mail.admin_address', 'admin@example.com');

        Mail::to($adminEmail)->queue(new ContactFormNotificationMail(
            name: $data['name'],
            email: $data['email'],
            body: $data['message'],
            phone: $data['phone'] ?? null,
        ));

        return response()->json([
            'success' => true,
            'data' => ['message' => 'Thank you for your message. We will get back to you soon.'],
        ]);
    }
}
