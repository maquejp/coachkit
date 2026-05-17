<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Booking;
use App\Models\ClassType;
use App\Models\CustomerSubscription;
use App\Models\PaymentTransaction;
use App\Models\PointCardPurchase;
use App\Models\SubscriptionPlan;
use App\Models\User;
use App\Models\WeeklySchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function customers(Request $request): JsonResponse
    {
        $from = $request->query('from');
        $to = $request->query('to');

        $query = User::where('role', 'customer')
            ->leftJoin('customer_subscriptions', function ($join) {
                $join->on('users.id', '=', 'customer_subscriptions.user_id')
                    ->whereRaw('customer_subscriptions.id = (select id from customer_subscriptions where user_id = users.id order by created_at desc limit 1)');
            })
            ->leftJoin('subscription_plans', 'customer_subscriptions.subscription_plan_id', '=', 'subscription_plans.id')
            ->leftJoin('bookings', 'users.id', '=', 'bookings.user_id')
            ->selectRaw('
                users.id,
                users.first_name,
                users.last_name,
                users.email,
                users.phone,
                customer_subscriptions.status,
                subscription_plans.name as subscription_plan,
                customer_subscriptions.sessions_used,
                customer_subscriptions.status as sub_status,
                count(bookings.id) as total_bookings,
                max(bookings.booking_date) as last_booking_date,
                users.created_at
            ')
            ->groupBy(
                'users.id', 'users.first_name', 'users.last_name',
                'users.email', 'users.phone',
                'customer_subscriptions.status',
                'subscription_plans.name',
                'customer_subscriptions.sessions_used',
                'users.created_at'
            );

        if ($from) {
            $query->where('users.created_at', '>=', $from);
        }
        if ($to) {
            $query->where('users.created_at', '<=', $to);
        }

        $rows = $query->get();

        return response()->json([
            'success' => true,
            'data' => $rows->map(fn ($row) => [
                'id' => $row->id,
                'name' => trim($row->first_name . ' ' . $row->last_name),
                'email' => $row->email,
                'phone' => $row->phone,
                'status' => $row->status ?? 'inactive',
                'subscriptionPlan' => $row->subscription_plan,
                'sessionsUsed' => (int) ($row->sessions_used ?? 0),
                'sessionsLimit' => null,
                'totalBookings' => (int) $row->total_bookings,
                'lastBookingDate' => $row->last_booking_date,
                'createdAt' => $row->created_at,
            ]),
        ]);
    }

    public function attendance(Request $request): JsonResponse
    {
        $data = $request->validate([
            'from' => 'required|date',
            'to' => 'required|date',
        ]);

        $records = Attendance::selectRaw("DATE(attendance.attended_at) as date")
            ->selectRaw('count(distinct attendance.id) as total_check_ins')
            ->selectRaw('count(distinct attendance.user_id) as unique_customers')
            ->whereBetween('attendance.attended_at', [$data['from'], $data['to'] . ' 23:59:59'])
            ->groupBy(DB::raw('DATE(attendance.attended_at)'))
            ->orderBy('date')
            ->get();

        $byClassRaw = Attendance::selectRaw("DATE(attendance.attended_at) as date")
            ->selectRaw('class_types.name as class_name, count(*) as count')
            ->join('class_types', 'attendance.class_type_id', '=', 'class_types.id')
            ->whereBetween('attendance.attended_at', [$data['from'], $data['to'] . ' 23:59:59'])
            ->groupBy(DB::raw('DATE(attendance.attended_at)'), 'class_types.name')
            ->orderBy('date')
            ->get()
            ->groupBy('date')
            ->map(fn ($items) => $items->map(fn ($c) => ['className' => $c->class_name, 'count' => (int) $c->count])->toArray());

        $result = $records->map(function ($record) use ($byClassRaw) {
            return [
                'date' => $record->date,
                'totalCheckIns' => (int) $record->total_check_ins,
                'uniqueCustomers' => (int) $record->unique_customers,
                'byClass' => $byClassRaw->get($record->date, []),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    public function subscriptions(): JsonResponse
    {
        $totalActive = CustomerSubscription::where('status', 'active')->count();
        $totalCancelled = CustomerSubscription::where('status', 'cancelled')->count();
        $totalExpired = CustomerSubscription::where('status', 'expired')->count();

        $monthlyRevenueCents = (int) PaymentTransaction::where('status', 'completed')
            ->where('created_at', '>=', now()->subMonth())
            ->sum('amount_cents');

        $annualRevenueCents = (int) PaymentTransaction::where('status', 'completed')
            ->where('created_at', '>=', now()->subYear())
            ->sum('amount_cents');

        $churnRate = ($totalActive + $totalCancelled) > 0
            ? round($totalCancelled / ($totalActive + $totalCancelled), 4)
            : 0;

        $byPlan = SubscriptionPlan::leftJoin('customer_subscriptions', 'subscription_plans.id', '=', 'customer_subscriptions.subscription_plan_id')
            ->selectRaw('subscription_plans.name as plan_name')
            ->selectRaw('count(case when customer_subscriptions.status = ? then 1 end) as active', ['active'])
            ->selectRaw('count(case when customer_subscriptions.status = ? then 1 end) as cancelled', ['cancelled'])
            ->groupBy('subscription_plans.name', 'subscription_plans.id')
            ->get()
            ->map(fn ($row) => [
                'planName' => $row->plan_name,
                'active' => (int) $row->active,
                'cancelled' => (int) $row->cancelled,
            ]);

        return response()->json([
            'success' => true,
            'data' => [
                'totalActive' => $totalActive,
                'totalCancelled' => $totalCancelled,
                'totalExpired' => $totalExpired,
                'monthlyRevenueCents' => $monthlyRevenueCents,
                'annualRevenueCents' => $annualRevenueCents,
                'churnRate' => $churnRate,
                'byPlan' => $byPlan,
            ],
        ]);
    }

    public function occupancy(Request $request): JsonResponse
    {
        $from = $request->query('from');
        $to = $request->query('to');

        $query = Booking::selectRaw('class_types.name as class_name')
            ->selectRaw('sum(weekly_schedule.max_capacity) as total_slots')
            ->selectRaw('count(*) as total_bookings')
            ->join('weekly_schedule', 'bookings.schedule_id', '=', 'weekly_schedule.id')
            ->join('class_types', 'weekly_schedule.class_type_id', '=', 'class_types.id')
            ->groupBy('class_types.name', 'class_types.id');

        if ($from) {
            $query->where('bookings.booking_date', '>=', $from);
        }
        if ($to) {
            $query->where('bookings.booking_date', '<=', $to);
        }

        $rows = $query->get();

        return response()->json([
            'success' => true,
            'data' => $rows->map(fn ($row) => [
                'className' => $row->class_name,
                'totalSlots' => (int) $row->total_slots,
                'totalBookings' => (int) $row->total_bookings,
                'averageOccupancy' => $row->total_slots > 0
                    ? round($row->total_bookings / $row->total_slots, 4)
                    : 0,
                'peakDay' => null,
                'peakTime' => null,
            ])->values(),
        ]);
    }

    public function revenue(): JsonResponse
    {
        $rows = PaymentTransaction::selectRaw("to_char(created_at, 'YYYY-MM') as month")
            ->selectRaw('sum(amount_cents) as revenue_cents')
            ->selectRaw("sum(case when subscription_id is not null then amount_cents else 0 end) as subscription_cents")
            ->selectRaw("sum(case when point_card_purchase_id is not null then amount_cents else 0 end) as point_card_cents")
            ->selectRaw("sum(case when booking_id is not null then amount_cents else 0 end) as bookings_cents")
            ->selectRaw('count(*) as transactions')
            ->where('status', 'completed')
            ->groupBy(DB::raw("to_char(created_at, 'YYYY-MM')"))
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'revenueCents' => (int) $row->revenue_cents,
                'subscriptionCents' => (int) $row->subscription_cents,
                'pointCardCents' => (int) $row->point_card_cents,
                'bookingsCents' => (int) $row->bookings_cents,
                'transactions' => (int) $row->transactions,
            ]);

        return response()->json([
            'success' => true,
            'data' => $rows,
        ]);
    }

    public function export(Request $request, string $type): \Illuminate\Http\Response
    {
        $rows = match ($type) {
            'customers' => $this->getCustomerExportRows($request),
            'attendance' => $this->getAttendanceExportRows($request),
            'subscriptions' => $this->getSubscriptionExportRows(),
            'occupancy' => $this->getOccupancyExportRows($request),
            'revenue' => $this->getRevenueExportRows(),
            default => [],
        };

        if (empty($rows)) {
            $csv = '';
        } else {
            $headers = array_keys($rows[0]);
            $csv = implode(',', $headers) . "\n";
            foreach ($rows as $row) {
                $csv .= implode(',', array_map(fn ($v) => '"' . str_replace('"', '""', $v ?? '') . '"', array_values($row))) . "\n";
            }
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $type . '-report.csv"',
        ]);
    }

    public function exportPdf(Request $request, string $type): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => null,
            'info' => 'PDF export is not yet implemented. Please use CSV export instead.',
        ]);
    }

    private function getCustomerExportRows(Request $request): array
    {
        $response = $this->customers($request);
        $data = $response->getData(true)['data'] ?? [];

        return array_map(fn ($row) => [
            'Name' => $row['name'],
            'Email' => $row['email'],
            'Phone' => $row['phone'] ?? '',
            'Status' => $row['status'],
            'Subscription Plan' => $row['subscriptionPlan'] ?? '',
            'Sessions Used' => (string) $row['sessionsUsed'],
            'Total Bookings' => (string) $row['totalBookings'],
            'Last Booking' => $row['lastBookingDate'] ?? '',
            'Created At' => $row['createdAt'] ?? '',
        ], $data);
    }

    private function getAttendanceExportRows(Request $request): array
    {
        $response = $this->attendance($request);
        $data = $response->getData(true)['data'] ?? [];

        return array_map(fn ($row) => [
            'Date' => $row['date'],
            'Total Check-Ins' => (string) $row['totalCheckIns'],
            'Unique Customers' => (string) $row['uniqueCustomers'],
        ], $data);
    }

    private function getSubscriptionExportRows(): array
    {
        $response = $this->subscriptions();
        $data = $response->getData(true)['data'] ?? [];

        $rows = [];
        foreach ($data['byPlan'] ?? [] as $plan) {
            $rows[] = [
                'Plan Name' => $plan['planName'],
                'Active' => (string) $plan['active'],
                'Cancelled' => (string) $plan['cancelled'],
            ];
        }

        $rows[] = [
            'Plan Name' => 'TOTALS',
            'Active' => (string) ($data['totalActive'] ?? 0),
            'Cancelled' => (string) ($data['totalCancelled'] ?? 0),
        ];

        return $rows;
    }

    private function getOccupancyExportRows(Request $request): array
    {
        $response = $this->occupancy($request);
        $data = $response->getData(true)['data'] ?? [];

        return array_map(fn ($row) => [
            'Class Name' => $row['className'],
            'Total Slots' => (string) $row['totalSlots'],
            'Total Bookings' => (string) $row['totalBookings'],
            'Avg Occupancy' => (string) $row['averageOccupancy'],
        ], $data);
    }

    private function getRevenueExportRows(): array
    {
        $response = $this->revenue();
        $data = $response->getData(true)['data'] ?? [];

        return array_map(fn ($row) => [
            'Month' => $row['month'],
            'Revenue (cents)' => (string) $row['revenueCents'],
            'Subscription (cents)' => (string) $row['subscriptionCents'],
            'Point Card (cents)' => (string) $row['pointCardCents'],
            'Bookings (cents)' => (string) $row['bookingsCents'],
            'Transactions' => (string) $row['transactions'],
        ], $data);
    }
}
