import { http, HttpResponse } from 'msw';
import { coaches } from '@/mocks/fixtures';

const coachStore = [...coaches];

export const coachHandlers = [
  http.get('/api/coaches', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 50;
    const total = coachStore.length;
    const totalPages = Math.ceil(total / pageSize);
    const items = coachStore.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({ success: true, data: { items, total, totalPages, page, pageSize } });
  }),

  http.get('/api/coaches/:id', ({ params }) => {
    const coach = coachStore.find((c) => c.id === params.id);
    if (!coach) return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: coach });
  }),

  http.post('/api/admin/coaches', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const coach = {
      id: `coach-${String(coachStore.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as (typeof coachStore)[0];
    coachStore.push(coach);
    return HttpResponse.json({ success: true, data: coach }, { status: 201 });
  }),

  http.put('/api/admin/coaches/:id', async ({ params, request }) => {
    const idx = coachStore.findIndex((c) => c.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    coachStore[idx] = {
      ...coachStore[idx],
      ...body,
      id: coachStore[idx].id,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: coachStore[idx] });
  }),

  http.delete('/api/admin/coaches/:id', ({ params }) => {
    const idx = coachStore.findIndex((c) => c.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    coachStore.splice(idx, 1);
    return HttpResponse.json({ success: true, data: null });
  }),
];
