import { http, HttpResponse } from 'msw';

export const reportsAdminHandlers = [
  http.get('/api/admin/reports/customers', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'user-002',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1-555-0102',
          status: 'active',
          subscriptionPlan: 'Monthly Unlimited',
          sessionsUsed: 12,
          sessionsLimit: 20,
          totalBookings: 15,
          lastBookingDate: '2025-05-14',
          createdAt: '2025-01-15',
        },
        {
          id: 'user-003',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          phone: '+1-555-0103',
          status: 'active',
          subscriptionPlan: 'Annual Unlimited',
          sessionsUsed: 8,
          sessionsLimit: null,
          totalBookings: 10,
          lastBookingDate: '2025-05-13',
          createdAt: '2025-02-01',
        },
        {
          id: 'user-004',
          name: 'Alice Williams',
          email: 'alice@example.com',
          phone: '+1-555-0104',
          status: 'inactive',
          subscriptionPlan: null,
          sessionsUsed: 0,
          sessionsLimit: null,
          totalBookings: 3,
          lastBookingDate: '2025-03-10',
          createdAt: '2025-03-01',
        },
      ],
    });
  }),

  http.get('/api/admin/reports/attendance', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          date: '2025-05-12',
          totalCheckIns: 28,
          uniqueCustomers: 22,
          byClass: [
            { className: 'Morning Yoga', count: 8 },
            { className: 'HIIT Circuit', count: 12 },
            { className: 'Pilates Flow', count: 8 },
          ],
        },
        {
          date: '2025-05-13',
          totalCheckIns: 24,
          uniqueCustomers: 19,
          byClass: [
            { className: 'Strength & Tone', count: 10 },
            { className: 'HIIT Circuit', count: 8 },
            { className: 'Evening Yoga', count: 6 },
          ],
        },
        {
          date: '2025-05-14',
          totalCheckIns: 20,
          uniqueCustomers: 16,
          byClass: [
            { className: 'Morning Yoga', count: 7 },
            { className: 'Pilates Flow', count: 6 },
            { className: 'Boxing Fit', count: 7 },
          ],
        },
      ],
    });
  }),

  http.get('/api/admin/reports/subscriptions', () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalActive: 85,
        totalCancelled: 12,
        totalExpired: 8,
        monthlyRevenueCents: 4250000,
        annualRevenueCents: 12000000,
        churnRate: 0.045,
        byPlan: [
          { planName: 'Monthly Unlimited', active: 40, cancelled: 6 },
          { planName: 'Monthly Basic', active: 20, cancelled: 4 },
          { planName: 'Annual Unlimited', active: 15, cancelled: 1 },
          { planName: 'Annual Basic', active: 10, cancelled: 1 },
        ],
      },
    });
  }),

  http.get('/api/admin/reports/occupancy', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          className: 'Morning Yoga',
          totalSlots: 20,
          totalBookings: 17,
          averageOccupancy: 0.85,
          peakDay: 'Monday',
          peakTime: '07:00',
        },
        {
          className: 'HIIT Circuit',
          totalSlots: 25,
          totalBookings: 22,
          averageOccupancy: 0.88,
          peakDay: 'Wednesday',
          peakTime: '12:00',
        },
        {
          className: 'Pilates Flow',
          totalSlots: 15,
          totalBookings: 11,
          averageOccupancy: 0.73,
          peakDay: 'Tuesday',
          peakTime: '10:00',
        },
        {
          className: 'Strength & Tone',
          totalSlots: 20,
          totalBookings: 14,
          averageOccupancy: 0.7,
          peakDay: 'Thursday',
          peakTime: '17:00',
        },
      ],
    });
  }),

  http.get('/api/admin/reports/revenue', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          month: '2025-01',
          revenueCents: 4250000,
          subscriptionCents: 3200000,
          pointCardCents: 750000,
          bookingsCents: 300000,
          transactions: 45,
        },
        {
          month: '2025-02',
          revenueCents: 3980000,
          subscriptionCents: 3100000,
          pointCardCents: 600000,
          bookingsCents: 280000,
          transactions: 42,
        },
        {
          month: '2025-03',
          revenueCents: 4520000,
          subscriptionCents: 3400000,
          pointCardCents: 800000,
          bookingsCents: 320000,
          transactions: 48,
        },
        {
          month: '2025-04',
          revenueCents: 4100000,
          subscriptionCents: 3150000,
          pointCardCents: 650000,
          bookingsCents: 300000,
          transactions: 44,
        },
        {
          month: '2025-05',
          revenueCents: 3850000,
          subscriptionCents: 3000000,
          pointCardCents: 550000,
          bookingsCents: 300000,
          transactions: 40,
        },
      ],
    });
  }),

  http.get('/api/admin/reports/:type/export', () => {
    return HttpResponse.text('name,email,status\nJane,jane@example.com,active\n', {
      headers: { 'Content-Type': 'text/csv' },
    });
  }),

  http.get('/api/admin/reports/:type/export-pdf', () => {
    return HttpResponse.text('PDF content', {
      headers: { 'Content-Type': 'application/pdf' },
    });
  }),
];
