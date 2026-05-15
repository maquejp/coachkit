<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SingleSessionPricingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ClassType::query();
        if ($classTypeId = $request->query('classTypeId')) {
            $query->where('id', $classTypeId);
        }

        $pricing = $query->get()->map(fn ($ct) => [
            'classTypeId' => $ct->id,
            'priceCents' => (int) $ct->default_price_cents,
        ]);

        return response()->json([
            'success' => true,
            'data' => $pricing,
        ]);
    }
}
