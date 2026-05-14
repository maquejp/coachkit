import { http, HttpResponse } from 'msw';
import type { AdminSettings } from '@/api/admin';

const defaultSettings: AdminSettings = {
  studioName: 'CoachKit Studio',
  studioEmail: 'hello@coachkit.app',
  studioPhone: '+1-555-0100',
  studioAddress: '123 Main Street',
  studioCity: 'Portland',
  timezone: 'America/New_York',
  defaultCurrency: 'EUR',
  businessHours: {
    1: { open: '06:00', close: '21:00', isClosed: false },
    2: { open: '06:00', close: '21:00', isClosed: false },
    3: { open: '06:00', close: '21:00', isClosed: false },
    4: { open: '06:00', close: '21:00', isClosed: false },
    5: { open: '06:00', close: '20:00', isClosed: false },
    6: { open: '08:00', close: '18:00', isClosed: false },
    7: { open: '08:00', close: '14:00', isClosed: true },
  },
  bookingLeadTimeMinutes: 60,
  cancellationWindowMinutes: 120,
  maxBookingsPerCustomer: 5,
  defaultEmailSender: 'noreply@coachkit.app',
  notifyOnBooking: true,
  notifyOnCancellation: true,
  notifyOnWaitlist: true,
  notifyOnReminder: true,
  taxRate: 8.5,
};

let settings: AdminSettings = {
  ...defaultSettings,
  businessHours: { ...defaultSettings.businessHours },
};

export const settingsHandlers = [
  http.get('/api/admin/settings', () => {
    return HttpResponse.json({ success: true, data: settings });
  }),
  http.put('/api/admin/settings', async ({ request }) => {
    const body = (await request.json()) as Partial<AdminSettings>;
    if (body.businessHours) {
      body.businessHours = { ...settings.businessHours, ...body.businessHours };
    }
    settings = { ...settings, ...body };
    return HttpResponse.json({ success: true, data: settings });
  }),
];
