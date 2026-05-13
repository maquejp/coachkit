import { http, HttpResponse } from 'msw';
import { attendanceRecords } from '@/mocks/fixtures';

const store = [...attendanceRecords];

export const attendanceHandlers = [
  http.get('/api/attendance', () => {
    return HttpResponse.json({ success: true, data: store });
  }),

  http.post('/api/attendance', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const record = {
      id: `att-${String(store.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString(),
    } as (typeof store)[0];
    store.push(record);
    return HttpResponse.json({ success: true, data: record }, { status: 201 });
  }),

  http.get('/api/attendance/report', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    let result = store;
    if (from) result = result.filter((r) => r.date >= from);
    if (to) result = result.filter((r) => r.date <= to);
    return HttpResponse.json({ success: true, data: { total: result.length, records: result } });
  }),
];
