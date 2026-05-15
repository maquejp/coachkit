<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Booking;
use App\Models\CustomerSubscription;
use App\Models\PaymentTransaction;
use App\Models\PointCardPurchase;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'customer');

        if ($search = $request->query('search')) {
            $like = '%' . $search . '%';
            $query->where(function ($q) use ($like) {
                $q->where('first_name', 'like', $like)
                  ->orWhere('last_name', 'like', $like)
                  ->orWhere('email', 'like', $like);
            });
        }

        $sortBy = $request->query('sortBy', 'created_at');
        $sortDir = $request->query('sortDir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $page = (int) $request->query('page', 1);
        $pageSize = (int) $request->query('pageSize', 20);

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => [
                'items' => collect($paginator->items())->map(fn ($u) => $this->camelize($u->toArray()))->toArray(),
                'total' => $paginator->total(),
                'totalPages' => $paginator->lastPage(),
                'page' => $paginator->currentPage(),
                'pageSize' => $paginator->perPage(),
            ],
        ]);
    }

    public function show($id): JsonResponse
    {
        $customer = User::where('role', 'customer')->find($id);

        if (!$customer) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $this->camelize($customer->toArray()),
        ]);
    }

    public function subscriptions($id): JsonResponse
    {
        $subscriptions = CustomerSubscription::where('user_id', $id)
            ->with('plan')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $subscriptions->map(fn ($sub) => [
                'id' => $sub->id,
                'userId' => $sub->user_id,
                'planId' => $sub->subscription_plan_id,
                'status' => $sub->status,
                'startDate' => $sub->start_date,
                'endDate' => $sub->end_date,
                'trialEnd' => null,
                'sessionsUsed' => (int) $sub->sessions_used,
                'sessionsLimit' => null,
                'planName' => $sub->relationLoaded('plan') && $sub->plan ? $sub->plan->name : null,
            ]),
        ]);
    }

    public function pointCards($id): JsonResponse
    {
        $purchases = PointCardPurchase::where('user_id', $id)
            ->with('plan')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $purchases->map(fn ($pc) => [
                'id' => $pc->id,
                'userId' => $pc->user_id,
                'planId' => $pc->point_card_plan_id,
                'sessionsRemaining' => (int) $pc->sessions_remaining,
                'expiresAt' => $pc->expiry_date,
                'purchasedAt' => $pc->purchase_date,
                'planName' => $pc->relationLoaded('plan') && $pc->plan ? $pc->plan->name : null,
            ]),
        ]);
    }

    public function bookings($id): JsonResponse
    {
        $bookings = Booking::where('user_id', $id)
            ->with('schedule.classType')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $bookings->map(fn ($b) => [
                'id' => $b->id,
                'userId' => $b->user_id,
                'classTypeId' => $b->relationLoaded('schedule') && $b->schedule ? $b->schedule->class_type_id : null,
                'date' => $b->booking_date,
                'status' => $b->status,
                'className' => $b->relationLoaded('schedule.classType') && $b->schedule && $b->schedule->classType ? $b->schedule->classType->name : null,
                'classColor' => $b->relationLoaded('schedule.classType') && $b->schedule && $b->schedule->classType ? $b->schedule->classType->color : null,
            ]),
        ]);
    }

    public function attendance($id): JsonResponse
    {
        $records = Attendance::where('user_id', $id)->get();

        return response()->json([
            'success' => true,
            'data' => $records->map(fn ($a) => [
                'id' => $a->id,
                'bookingId' => $a->booking_id,
                'userId' => $a->user_id,
                'date' => $a->attended_at ? $a->attended_at->format('Y-m-d') : null,
                'checkInTime' => $a->attended_at ? $a->attended_at->format('H:i:s') : null,
            ]),
        ]);
    }

    public function payments($id): JsonResponse
    {
        $transactions = PaymentTransaction::where('user_id', $id)->get();

        return response()->json([
            'success' => true,
            'data' => $transactions->map(fn ($t) => [
                'id' => $t->id,
                'userId' => $t->user_id,
                'amountCents' => (int) $t->amount_cents,
                'currency' => $t->currency,
                'status' => $t->status,
                'provider' => $t->payment_method,
                'description' => $t->description,
                'createdAt' => $t->created_at,
            ]),
        ]);
    }

    public function impersonate(Request $request): JsonResponse
    {
        $data = $request->validate(['userId' => 'required|exists:users,id']);

        $user = User::find($data['userId']);

        if (!$user) {
            return response()->json(['success' => false, 'error' => 'Not found'], 404);
        }

        $token = $user->createToken('impersonation')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $this->camelize($user->toArray()),
                'token' => $token,
            ],
        ]);
    }

    private function camelize(array $data): array
    {
        return collect($data)->mapWithKeys(fn ($value, $key) => [Str::camel($key) => $value])->toArray();
    }
}
