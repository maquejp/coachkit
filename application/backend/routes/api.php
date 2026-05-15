<?php

use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\AttendanceController as AdminAttendanceController;
use App\Http\Controllers\Api\Admin\CustomerController as AdminCustomerController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\SessionUsageController;
use App\Http\Controllers\Api\Admin\SettingsController;
use App\Http\Controllers\Api\Admin\WaitlistController as AdminWaitlistController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ClassTypeController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\CoachController;
use App\Http\Controllers\Api\CustomerSubscriptionController;
use App\Http\Controllers\Api\GuestController;
use App\Http\Controllers\Api\InstructorController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PointCardPlanController;
use App\Http\Controllers\Api\PointCardPurchaseController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ScheduleExceptionController;
use App\Http\Controllers\Api\SingleSessionPricingController;
use App\Http\Controllers\Api\SubscriptionPlanController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PayPalController;
use App\Http\Controllers\Api\StripeWebhookController;
use App\Http\Controllers\Api\WaitlistController;
use App\Http\Controllers\Api\WeeklyScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (no authentication required)
|--------------------------------------------------------------------------
*/

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook']);
Route::post('/paypal/webhook', [PayPalController::class, 'webhook']);

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/password-reset-request', function () {
    return response()->json(['success' => true, 'data' => null]);
});
Route::post('/auth/password-reset', function () {
    return response()->json(['success' => true, 'data' => null]);
});

Route::get('/free-session-claims/check', [GuestController::class, 'checkClaim']);
Route::post('/free-session-claims', [GuestController::class, 'createClaim']);
Route::post('/guest/register', [GuestController::class, 'register']);

Route::get('/subscription-plans', [SubscriptionPlanController::class, 'index']);
Route::get('/subscription-plans/{id}', [SubscriptionPlanController::class, 'show']);

Route::get('/point-card-plans', [PointCardPlanController::class, 'index']);
Route::get('/point-card-plans/{id}', [PointCardPlanController::class, 'show']);

Route::post('/contact', [ContactController::class, 'submit']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes (auth:sanctum required)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Profile
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    Route::post('/bookings/{id}/reschedule', [BookingController::class, 'reschedule']);

    // Instructor
    Route::get('/instructor/schedule', [InstructorController::class, 'schedule']);
    Route::get('/instructor/upcoming', [InstructorController::class, 'upcoming']);
    Route::get('/instructor/stats', [InstructorController::class, 'stats']);
    Route::get('/instructor/attendance', [InstructorController::class, 'attendance']);

    // Customer Subscriptions
    Route::get('/customer-subscriptions', [CustomerSubscriptionController::class, 'index']);
    Route::post('/customer-subscriptions', [CustomerSubscriptionController::class, 'store']);
    Route::put('/customer-subscriptions/{id}/change-plan', [CustomerSubscriptionController::class, 'changePlan']);
    Route::post('/customer-subscriptions/{id}/cancel', [CustomerSubscriptionController::class, 'cancel']);

    // Point Card Purchases
    Route::get('/point-card-purchases', [PointCardPurchaseController::class, 'index']);
    Route::post('/point-card-purchases', [PointCardPurchaseController::class, 'store']);

    // Waitlist (customer-facing)
    Route::get('/waitlist', [WaitlistController::class, 'index']);
    Route::post('/waitlist/join', [WaitlistController::class, 'join']);
    Route::post('/waitlist/{id}/leave', [WaitlistController::class, 'leave']);
    Route::post('/waitlist/{id}/promote', [WaitlistController::class, 'promote']);

    // Single Session Pricing
    Route::get('/single-session-pricing', [SingleSessionPricingController::class, 'index']);

    // Payments (Stripe)
    Route::post('/payments/stripe/create-setup-intent', [PaymentController::class, 'createSetupIntent']);
    Route::post('/payments/stripe/create-payment-intent', [PaymentController::class, 'createPaymentIntent']);
    Route::post('/payments/stripe/confirm-payment', [PaymentController::class, 'confirmPayment']);
    Route::get('/payments/history', [PaymentController::class, 'history']);

    // Payments (PayPal)
    Route::post('/payments/paypal/create-order', [PayPalController::class, 'createOrder']);
    Route::post('/payments/paypal/capture-order', [PayPalController::class, 'captureOrder']);

    // Locations
    Route::get('/locations', [LocationController::class, 'index']);
    Route::post('/locations', [LocationController::class, 'store']);
    Route::put('/locations/{id}', [LocationController::class, 'update']);
    Route::delete('/locations/{id}', [LocationController::class, 'destroy']);

    // Class Types
    Route::get('/class-types', [ClassTypeController::class, 'index']);
    Route::post('/class-types', [ClassTypeController::class, 'store']);
    Route::put('/class-types/{id}', [ClassTypeController::class, 'update']);
    Route::delete('/class-types/{id}', [ClassTypeController::class, 'destroy']);

    // Coaches
    Route::get('/coaches', [CoachController::class, 'index']);
    Route::get('/coaches/{id}', [CoachController::class, 'show']);
    Route::post('/coaches', [CoachController::class, 'store']);
    Route::put('/coaches/{id}', [CoachController::class, 'update']);
    Route::delete('/coaches/{id}', [CoachController::class, 'destroy']);

    // Weekly Schedule
    Route::get('/weekly-schedule', [WeeklyScheduleController::class, 'index']);
    Route::post('/weekly-schedule', [WeeklyScheduleController::class, 'store']);
    Route::put('/weekly-schedule/{id}', [WeeklyScheduleController::class, 'update']);
    Route::delete('/weekly-schedule/{id}', [WeeklyScheduleController::class, 'destroy']);

    // Schedule Exceptions
    Route::get('/schedule-exceptions', [ScheduleExceptionController::class, 'index']);
    Route::post('/schedule-exceptions', [ScheduleExceptionController::class, 'store']);
    Route::put('/schedule-exceptions/{id}', [ScheduleExceptionController::class, 'update']);
    Route::delete('/schedule-exceptions/{id}', [ScheduleExceptionController::class, 'destroy']);

    // Attendance
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::post('/attendance', [AttendanceController::class, 'store']);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes (auth:sanctum + admin middleware required)
    |--------------------------------------------------------------------------
    */

    Route::middleware('admin')->prefix('admin')->group(function () {
        // Dashboard
        Route::get('/dashboard/kpis', [DashboardController::class, 'kpis']);
        Route::get('/dashboard/charts', [DashboardController::class, 'charts']);
        Route::get('/dashboard/occupancy', [DashboardController::class, 'occupancy']);

        // Customers
        Route::get('/customers', [AdminCustomerController::class, 'index']);
        Route::get('/customers/{id}', [AdminCustomerController::class, 'show']);
        Route::get('/customers/{id}/subscriptions', [AdminCustomerController::class, 'subscriptions']);
        Route::get('/customers/{id}/point-cards', [AdminCustomerController::class, 'pointCards']);
        Route::get('/customers/{id}/bookings', [AdminCustomerController::class, 'bookings']);
        Route::get('/customers/{id}/attendance', [AdminCustomerController::class, 'attendance']);
        Route::get('/customers/{id}/payments', [AdminCustomerController::class, 'payments']);
        Route::post('/impersonate', [AdminCustomerController::class, 'impersonate']);

        // Attendance (admin)
        Route::get('/attendance/check-in', [AdminAttendanceController::class, 'checkInBookings']);
        Route::post('/attendance/check-in', [AdminAttendanceController::class, 'checkIn']);
        Route::get('/attendance/report', [AdminAttendanceController::class, 'report']);

        // Session Usage
        Route::get('/session-usage', [SessionUsageController::class, 'index']);

        // Subscription Plans (admin CRUD)
        Route::post('/subscription-plans', [SubscriptionPlanController::class, 'store']);
        Route::put('/subscription-plans/{id}', [SubscriptionPlanController::class, 'update']);
        Route::delete('/subscription-plans/{id}', [SubscriptionPlanController::class, 'destroy']);

        // Point Card Plans (admin CRUD)
        Route::post('/point-card-plans', [PointCardPlanController::class, 'store']);
        Route::put('/point-card-plans/{id}', [PointCardPlanController::class, 'update']);
        Route::delete('/point-card-plans/{id}', [PointCardPlanController::class, 'destroy']);

        // Waitlist (admin)
        Route::get('/waitlist', [AdminWaitlistController::class, 'index']);
        Route::post('/waitlist/{id}/promote', [AdminWaitlistController::class, 'promote']);
        Route::post('/waitlist/{id}/remove', [AdminWaitlistController::class, 'remove']);
        Route::post('/waitlist/notify-all', [AdminWaitlistController::class, 'notifyAll']);

        // Reports
        Route::get('/reports/customers', [ReportController::class, 'customers']);
        Route::get('/reports/attendance', [ReportController::class, 'attendance']);
        Route::get('/reports/subscriptions', [ReportController::class, 'subscriptions']);
        Route::get('/reports/occupancy', [ReportController::class, 'occupancy']);
        Route::get('/reports/revenue', [ReportController::class, 'revenue']);
        Route::get('/reports/{type}/export', [ReportController::class, 'export']);
        Route::get('/reports/{type}/export-pdf', [ReportController::class, 'exportPdf']);

        // Analytics
        Route::get('/analytics', [AnalyticsController::class, 'index']);

        // Settings
        Route::get('/settings', [SettingsController::class, 'show']);
        Route::put('/settings', [SettingsController::class, 'update']);
    });
});
