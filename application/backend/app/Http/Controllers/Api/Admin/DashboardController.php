<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CustomerSubscription;
use App\Models\PaymentTransaction;
use App\Models\WeeklySchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function kpis(): JsonResponse
    {
        $totalBookings = Booking::count();
        $confirmedBookings = Booking::where('status', 'confirmed')->count();
        $revenueCents = (int) PaymentTransaction::where('status', 'completed')->sum('amount_cents');
        $activeMembers = CustomerSubscription::where('status', 'active')->count();

        $totalCapacity = (int) WeeklySchedule::sum('max_capacity');
        $occupancyRate = $totalCapacity > 0 ? round($totalBookings / $totalCapacity, 4) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'totalBookings' => $totalBookings,
                'confirmedBookings' => $confirmedBookings,
                'revenueCents' => $revenueCents,
                'activeMembers' => $activeMembers,
                'occupancyRate' => $occupancyRate,
            ],
        ]);
    }

    public function charts(): JsonResponse
    {
        $bookingsByDay = Booking::selectRaw('booking_date as date, count(*) as count')
            ->where('booking_date', '>=', now()->subDays(30))
            ->groupBy('booking_date')
            ->orderBy('booking_date')
            ->get()
            ->toArray();

        $revenueByMonth = PaymentTransaction::selectRaw(
            "to_char(created_at, 'YYYY-MM') as month, sum(amount_cents) as amount_cents"
        )
            ->where('created_at', '>=', now()->subMonths(12))
            ->where('status', 'completed')
            ->groupBy(DB::raw("to_char(created_at, 'YYYY-MM')"))
            ->orderBy('month')
            ->get()
            ->toArray();

        $classPopularity = Booking::selectRaw('class_type_id, count(*) as bookings')
            ->join('weekly_schedule', 'bookings.schedule_id', '=', 'weekly_schedule.id')
            ->join('class_types', 'weekly_schedule.class_type_id', '=', 'class_types.id')
            ->selectRaw('class_types.name as class_name, count(*) as bookings')
            ->groupBy('class_types.name', 'class_types.id')
            ->orderByDesc('bookings')
            ->get()
            ->map(fn ($row) => [
                'className' => $row->class_name,
                'bookings' => (int) $row->bookings,
            ])
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => [
                'bookingsByDay' => $bookingsByDay,
                'revenueByMonth' => $revenueByMonth,
                'classPopularity' => $classPopularity,
            ],
        ]);
    }

    public function occupancy(): JsonResponse
    {
        $totalCapacity = (int) WeeklySchedule::sum('max_capacity');
        $totalBookings = Booking::count();
        $averageOccupancy = $totalCapacity > 0 ? round($totalBookings / $totalCapacity, 4) : 0;

        $peakDay = Booking::selectRaw("to_char(booking_date, 'Day') as day_name, count(*) as cnt")
            ->join('weekly_schedule', 'bookings.schedule_id', '=', 'weekly_schedule.id')
            ->groupBy(DB::raw("to_char(booking_date, 'Day')"))
            ->orderByDesc('cnt')
            ->first();

        $peakTime = Booking::selectRaw('weekly_schedule.start_time, count(*) as cnt')
            ->join('weekly_schedule', 'bookings.schedule_id', '=', 'weekly_schedule.id')
            ->groupBy('weekly_schedule.start_time')
            ->orderByDesc('cnt')
            ->first();

        $byClass = Booking::selectRaw('class_types.name as class_name')
            ->selectRaw('sum(weekly_schedule.max_capacity) as total_capacity')
            ->selectRaw('count(*) as total_bookings')
            ->join('weekly_schedule', 'bookings.schedule_id', '=', 'weekly_schedule.id')
            ->join('class_types', 'weekly_schedule.class_type_id', '=', 'class_types.id')
            ->groupBy('class_types.name', 'class_types.id')
            ->get()
            ->map(fn ($row) => [
                'className' => $row->class_name,
                'occupancy' => $row->total_capacity > 0
                    ? round($row->total_bookings / $row->total_capacity, 4)
                    : 0,
            ])
            ->toArray();

        return response()->json([
            'success' => true,
            'data' => [
                'averageOccupancy' => $averageOccupancy,
                'peakDay' => $peakDay ? trim($peakDay->day_name) : null,
                'peakTime' => $peakTime ? $peakTime->start_time : null,
                'byClass' => $byClass,
            ],
        ]);
    }
}
