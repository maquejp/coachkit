import { http, HttpResponse } from 'msw';
import { classTypes } from '@/mocks/fixtures';

const store = [...classTypes];

export const classTypeHandlers = [
  http.get('/api/class-types', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 50;
    const total = store.length;
    const totalPages = Math.ceil(total / pageSize);
    const items = store.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({ success: true, data: { items, total, totalPages, page, pageSize } });
  }),

  http.get('/api/class-types/:id', ({ params }) => {
    const ct = store.find((c) => c.id === params.id);
    if (!ct) return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: ct });
  }),

  http.post('/api/admin/class-types', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const ct = {
      id: `ct-${String(store.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as (typeof store)[0];
    store.push(ct);
    return HttpResponse.json({ success: true, data: ct }, { status: 201 });
  }),

  http.put('/api/admin/class-types/:id', async ({ params, request }) => {
    const idx = store.findIndex((c) => c.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    store[idx] = { ...store[idx], ...body, id: store[idx].id, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: store[idx] });
  }),

  http.delete('/api/admin/class-types/:id', ({ params }) => {
    const idx = store.findIndex((c) => c.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    store.splice(idx, 1);
    return HttpResponse.json({ success: true, data: null });
  }),
];
