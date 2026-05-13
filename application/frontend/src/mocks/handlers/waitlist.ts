import { http, HttpResponse } from 'msw';
import { waitlistEntries } from '@/mocks/fixtures';

const store = [...waitlistEntries];

export const waitlistHandlers = [
  http.get('/api/waitlist', ({ request }) => {
    const url = new URL(request.url);
    const scheduleId = url.searchParams.get('scheduleId');
    let result = store;
    if (scheduleId) result = result.filter((w) => w.scheduleId === scheduleId);
    return HttpResponse.json({ success: true, data: result });
  }),

  http.post('/api/waitlist/join', async ({ request }) => {
    const body = (await request.json()) as { userId: string; scheduleId: string; date: string };
    const position =
      store.filter((w) => w.scheduleId === body.scheduleId && w.date === body.date).length + 1;
    const entry = {
      id: `wl-${String(store.length + 1).padStart(3, '0')}`,
      ...body,
      position,
      status: 'waiting' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.push(entry);
    return HttpResponse.json({ success: true, data: entry }, { status: 201 });
  }),

  http.post('/api/waitlist/:id/leave', ({ params }) => {
    const idx = store.findIndex((w) => w.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    store.splice(idx, 1);
    return HttpResponse.json({ success: true, data: null });
  }),

  http.post('/api/waitlist/:id/promote', ({ params }) => {
    const idx = store.findIndex((w) => w.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    store[idx] = { ...store[idx], status: 'promoted', updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: store[idx] });
  }),
];
