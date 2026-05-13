import { http, HttpResponse } from 'msw';
import { bookings } from '@/mocks/fixtures';

const store = [...bookings];

export const bookingHandlers = [
  http.get('/api/bookings', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    let result = store;
    if (userId) result = result.filter((b) => b.userId === userId);
    return HttpResponse.json({ success: true, data: result });
  }),

  http.post('/api/bookings', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const booking = {
      id: `bkg-${String(store.length + 1).padStart(3, '0')}`,
      ...body,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as (typeof store)[0];
    store.push(booking);
    return HttpResponse.json({ success: true, data: booking }, { status: 201 });
  }),

  http.post('/api/bookings/:id/cancel', ({ params }) => {
    const idx = store.findIndex((b) => b.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    store[idx] = { ...store[idx], status: 'cancelled', updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: store[idx] });
  }),

  http.post('/api/bookings/:id/check-in', ({ params }) => {
    const idx = store.findIndex((b) => b.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    store[idx] = { ...store[idx], status: 'attended', updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: store[idx] });
  }),
];
