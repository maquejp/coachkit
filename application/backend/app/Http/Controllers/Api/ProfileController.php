<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'firstName' => 'sometimes|string|max:255',
            'lastName' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:50',
        ]);

        $data = [];
        if (isset($validated['firstName'])) $data['first_name'] = $validated['firstName'];
        if (isset($validated['lastName'])) $data['last_name'] = $validated['lastName'];
        if (isset($validated['email'])) $data['email'] = $validated['email'];
        if (array_key_exists('phone', $validated)) $data['phone'] = $validated['phone'];

        $user->update($data);
        $user->refresh();

        return response()->json([
            'success' => true,
            'data' => collect($user->toArray())
                ->mapWithKeys(fn ($v, $k) => [Str::camel($k) => $v])
                ->toArray(),
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:8',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['currentPassword'], $user->password)) {
            return response()->json(['success' => false, 'error' => 'Current password is incorrect'], 422);
        }

        $user->update(['password' => bcrypt($validated['newPassword'])]);

        return response()->json(['success' => true, 'data' => null]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->delete();

        return response()->json(['success' => true, 'data' => null]);
    }
}
