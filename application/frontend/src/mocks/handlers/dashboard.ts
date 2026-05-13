import { http, HttpResponse } from 'msw';
import { bookings, paymentTransactions, customerUsers } from '@/mocks/fixtures';

export const dashboardHandlers = [
  http.get('/api/dashboard/kpis', () => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;
    const revenue = paymentTransactions
      .filter((p) => p.status === 'succeeded')
      .reduce((s, p) => s + p.amountCents, 0);
    const activeMembers = customerUsers.length;

    return HttpResponse.json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        revenueCents: revenue,
        activeMembers,
        occupancyRate: 0.72,
      },
    });
  }),

  http.get('/api/dashboard/charts', () => {
    return HttpResponse.json({
      success: true,
      data: {
        bookingsByDay: [
          { date: '2025-05-12', count: 4 },
          { date: '2025-05-13', count: 3 },
          { date: '2025-05-14', count: 2 },
          { date: '2025-05-15', count: 1 },
          { date: '2025-05-16', count: 2 },
          { date: '2025-05-17', count: 1 },
        ],
        revenueByMonth: [
          { month: '2025-01', amountCents: 89900 },
          { month: '2025-02', amountCents: 9900 },
          { month: '2025-03', amountCents: 25900 },
          { month: '2025-04', amountCents: 0 },
          { month: '2025-05', amountCents: 0 },
        ],
        classPopularity: [
          { className: 'Morning Yoga', bookings: 12 },
          { className: 'HIIT Circuit', bookings: 10 },
          { className: 'Pilates Flow', bookings: 8 },
          { className: 'Strength & Tone', bookings: 6 },
        ],
      },
    });
  }),

  http.get('/api/dashboard/occupancy', () => {
    return HttpResponse.json({
      success: true,
      data: {
        averageOccupancy: 0.72,
        peakDay: 'Monday',
        peakTime: '07:00',
        byClass: [
          { className: 'Morning Yoga', occupancy: 0.85 },
          { className: 'HIIT Circuit', occupancy: 0.9 },
          { className: 'Pilates Flow', occupancy: 0.7 },
          { className: 'Strength & Tone', occupancy: 0.6 },
        ],
      },
    });
  }),
];
