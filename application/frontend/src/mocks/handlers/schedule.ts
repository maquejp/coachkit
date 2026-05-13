import { http, HttpResponse } from 'msw';
import { weeklySchedule, scheduleExceptions } from '@/mocks/fixtures';

const wsStore = [...weeklySchedule];
const exStore = [...scheduleExceptions];

export const scheduleHandlers = [
  http.get('/api/weekly-schedule', ({ request }) => {
    const url = new URL(request.url);
    const day = url.searchParams.get('day');
    if (day)
      return HttpResponse.json({
        success: true,
        data: wsStore.filter((s) => s.dayOfWeek === Number(day)),
      });
    return HttpResponse.json({ success: true, data: wsStore });
  }),

  http.get('/api/weekly-schedule/:id', ({ params }) => {
    const item = wsStore.find((s) => s.id === params.id);
    if (!item) return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: item });
  }),

  http.post('/api/weekly-schedule', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const item = {
      id: `ws-${String(wsStore.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as (typeof wsStore)[0];
    wsStore.push(item);
    return HttpResponse.json({ success: true, data: item }, { status: 201 });
  }),

  http.put('/api/weekly-schedule/:id', async ({ params, request }) => {
    const idx = wsStore.findIndex((s) => s.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    wsStore[idx] = {
      ...wsStore[idx],
      ...body,
      id: wsStore[idx].id,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: wsStore[idx] });
  }),

  http.delete('/api/weekly-schedule/:id', ({ params }) => {
    const idx = wsStore.findIndex((s) => s.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    wsStore.splice(idx, 1);
    return HttpResponse.json({ success: true, data: null });
  }),

  http.get('/api/schedule-exceptions', ({ request }) => {
    const url = new URL(request.url);
    const locId = url.searchParams.get('locationId');
    let result = exStore;
    if (locId) result = result.filter((e) => e.locationId === locId);
    return HttpResponse.json({ success: true, data: result });
  }),

  http.post('/api/schedule-exceptions', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const item = {
      id: `se-${String(exStore.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as (typeof exStore)[0];
    exStore.push(item);
    return HttpResponse.json({ success: true, data: item }, { status: 201 });
  }),

  http.put('/api/schedule-exceptions/:id', async ({ params, request }) => {
    const idx = exStore.findIndex((e) => e.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    const body = (await request.json()) as Record<string, unknown>;
    exStore[idx] = {
      ...exStore[idx],
      ...body,
      id: exStore[idx].id,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: exStore[idx] });
  }),

  http.delete('/api/schedule-exceptions/:id', ({ params }) => {
    const idx = exStore.findIndex((e) => e.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    exStore.splice(idx, 1);
    return HttpResponse.json({ success: true, data: null });
  }),
];
