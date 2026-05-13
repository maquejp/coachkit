import { http, HttpResponse } from 'msw';
import { locations } from '@/mocks/fixtures';

const store = [...locations];

export const locationHandlers = [
  http.get('/api/locations', () => {
    return HttpResponse.json({ success: true, data: store });
  }),

  http.get('/api/locations/:id', ({ params }) => {
    const loc = store.find((l) => l.id === params.id);
    if (!loc) return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: loc });
  }),

  http.post('/api/locations', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const loc = {
      id: `loc-${String(store.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as (typeof store)[0];
    store.push(loc);
    return HttpResponse.json({ success: true, data: loc }, { status: 201 });
  }),

  http.put('/api/locations/:id', async ({ params, request }) => {
    const idx = store.findIndex((l) => l.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    store[idx] = { ...store[idx], ...body, id: store[idx].id, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: store[idx] });
  }),

  http.delete('/api/locations/:id', ({ params }) => {
    const idx = store.findIndex((l) => l.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    store.splice(idx, 1);
    return HttpResponse.json({ success: true, data: null });
  }),
];
