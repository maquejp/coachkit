import { http, HttpResponse } from 'msw';
import { waitlistEntries, customerUsers, weeklySchedule } from '@/mocks/fixtures';
import { classTypes } from '@/mocks/fixtures/classTypes';

const store = [...waitlistEntries];

export const waitlistAdminHandlers = [
  http.get('/api/admin/waitlist', ({ request }) => {
    const url = new URL(request.url);
    const scheduleId = url.searchParams.get('scheduleId');
    const date = url.searchParams.get('date');

    let result = store;
    if (scheduleId) result = result.filter((w) => w.scheduleId === scheduleId);
    if (date) result = result.filter((w) => w.date === date);

    const enriched = result.map((w) => {
      const user = customerUsers.find((u) => u.id === w.userId);
      const slot = weeklySchedule.find((s) => s.id === w.scheduleId);
      const ct = slot ? classTypes.find((c) => c.id === slot.classTypeId) : null;
      return {
        ...w,
        customerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        className: ct?.name ?? 'Unknown',
        classColor: ct?.color ?? '#ccc',
      };
    });

    return HttpResponse.json({ success: true, data: enriched });
  }),

  http.post('/api/admin/waitlist/:id/promote', ({ params }) => {
    const idx = store.findIndex((w) => w.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    store[idx] = { ...store[idx], status: 'promoted', updatedAt: new Date().toISOString() };
    const w = store[idx];
    const user = customerUsers.find((u) => u.id === w.userId);
    return HttpResponse.json({
      success: true,
      data: {
        ...w,
        customerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      },
    });
  }),

  http.post('/api/admin/waitlist/:id/remove', ({ params }) => {
    const idx = store.findIndex((w) => w.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    store.splice(idx, 1);
    return HttpResponse.json({ success: true, data: null });
  }),

  http.post('/api/admin/waitlist/notify-all', async ({ request }) => {
    const { scheduleId, date } = (await request.json()) as { scheduleId: string; date: string };
    const toNotify = store.filter(
      (w) => w.scheduleId === scheduleId && w.date === date && w.status === 'waiting',
    );
    return HttpResponse.json({
      success: true,
      data: { notified: toNotify.length, message: `${toNotify.length} customer(s) notified.` },
    });
  }),
];
