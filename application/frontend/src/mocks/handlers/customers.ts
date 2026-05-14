import { http, HttpResponse } from 'msw';
import {
  customerUsers,
  customerSubscriptions,
  pointCardPurchases,
  bookings,
  attendanceRecords,
  paymentTransactions,
} from '@/mocks/fixtures';
import { classTypes } from '@/mocks/fixtures/classTypes';
import { subscriptionPlans, pointCardPlans } from '@/mocks/fixtures/subscriptions';

const customerStore = [...customerUsers];

export const customerHandlers = [
  http.get('/api/admin/customers', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10');
    const sortBy = url.searchParams.get('sortBy') ?? 'createdAt';
    const sortDir = url.searchParams.get('sortDir') ?? 'desc';

    let filtered = customerStore;
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.firstName.toLowerCase().includes(search) ||
          u.lastName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search),
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a] ?? '';
      const bVal = b[sortBy as keyof typeof b] ?? '';
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === 'asc' ? cmp : -cmp;
    });

    const total = sorted.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    return HttpResponse.json({
      success: true,
      data: {
        items,
        total,
        totalPages,
        page,
        pageSize,
      },
    });
  }),

  http.get('/api/admin/customers/:id', ({ params }) => {
    const user = customerStore.find((u) => u.id === params.id);
    if (!user) return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: user });
  }),

  http.get('/api/admin/customers/:id/subscriptions', ({ params }) => {
    const subs = customerSubscriptions
      .filter((s) => s.userId === params.id)
      .map((s) => {
        const plan = subscriptionPlans.find((p) => p.id === s.planId);
        return { ...s, planName: plan?.name ?? 'Unknown' };
      });
    return HttpResponse.json({ success: true, data: subs });
  }),

  http.get('/api/admin/customers/:id/point-cards', ({ params }) => {
    const cards = pointCardPurchases
      .filter((p) => p.userId === params.id)
      .map((p) => {
        const plan = pointCardPlans.find((pl) => pl.id === p.planId);
        return { ...p, planName: plan?.name ?? 'Unknown' };
      });
    return HttpResponse.json({ success: true, data: cards });
  }),

  http.get('/api/admin/customers/:id/bookings', ({ params }) => {
    const custBookings = bookings
      .filter((b) => b.userId === params.id)
      .map((b) => {
        const ct = classTypes.find((c) => c.id === b.classTypeId);
        return { ...b, className: ct?.name ?? 'Unknown', classColor: ct?.color ?? '#ccc' };
      });
    return HttpResponse.json({ success: true, data: custBookings });
  }),

  http.get('/api/admin/customers/:id/attendance', ({ params }) => {
    const records = attendanceRecords.filter((a) => a.userId === params.id);
    return HttpResponse.json({ success: true, data: records });
  }),

  http.get('/api/admin/customers/:id/payments', ({ params }) => {
    const txns = paymentTransactions.filter((p) => p.userId === params.id);
    return HttpResponse.json({ success: true, data: txns });
  }),

  http.post('/api/admin/impersonate', async ({ request }) => {
    const { userId } = (await request.json()) as { userId: string };
    const user = customerStore.find((u) => u.id === userId);
    if (!user) return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return HttpResponse.json({
      success: true,
      data: { user, token: `mock-impersonate-token-${user.id}` },
    });
  }),
];
