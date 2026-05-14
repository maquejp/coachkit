import { http, HttpResponse } from 'msw';

export const analyticsHandlers = [
  http.get('/api/admin/analytics', () => {
    return HttpResponse.json({
      success: true,
      data: {
        conversionRate: 0.068,
        bounceRate: 0.32,
        avgSessionDuration: 245,
        totalPageViews: 15280,
        uniqueVisitors: 8940,
        popularClasses: [
          { className: 'HIIT Circuit', bookings: 320, revenueCents: 4800000 },
          { className: 'Morning Yoga', bookings: 280, revenueCents: 4200000 },
          { className: 'Pilates Flow', bookings: 195, revenueCents: 2925000 },
          { className: 'Strength & Tone', bookings: 180, revenueCents: 2700000 },
          { className: 'Boxing Fit', bookings: 150, revenueCents: 2250000 },
        ],
        peakBookingTimes: [
          { timeSlot: '07:00–08:00', count: 420, percentage: 28 },
          { timeSlot: '12:00–13:00', count: 380, percentage: 25 },
          { timeSlot: '17:00–18:00', count: 350, percentage: 23 },
          { timeSlot: '18:00–19:00', count: 200, percentage: 13 },
          { timeSlot: '09:00–10:00', count: 170, percentage: 11 },
        ],
        referralSources: [
          { source: 'Direct', count: 3576, percentage: 40 },
          { source: 'Google Organic', count: 2235, percentage: 25 },
          { source: 'Instagram', count: 1341, percentage: 15 },
          { source: 'Facebook', count: 894, percentage: 10 },
          { source: 'Referral', count: 894, percentage: 10 },
        ],
      },
    });
  }),
];
