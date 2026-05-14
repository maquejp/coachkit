import { http, HttpResponse } from 'msw';
import {
  bookings,
  attendanceRecords,
  customerUsers,
  customerSubscriptions,
  pointCardPurchases,
} from '@/mocks/fixtures';
import { classTypes } from '@/mocks/fixtures/classTypes';
import { subscriptionPlans, pointCardPlans } from '@/mocks/fixtures/subscriptions';

const attStore = [...attendanceRecords];
const bookingStore = [...bookings];

export const attendanceAdminHandlers = [
  http.get('/api/admin/attendance/check-in', ({ request }) => {
    const url = new URL(request.url);
    const date = url.searchParams.get('date') ?? '';

    const dayBookings = bookingStore.filter(
      (b) => b.date === date && (b.status === 'confirmed' || b.status === 'attended'),
    );

    const enriched = dayBookings.map((b) => {
      const user = customerUsers.find((u) => u.id === b.userId);
      const ct = classTypes.find((c) => c.id === b.classTypeId);
      const att = attStore.find((a) => a.bookingId === b.id);
      return {
        ...b,
        customerName: user ? `${user.firstName} ${user.lastName}` : (b.guestEmail ?? 'Unknown'),
        className: ct?.name ?? 'Unknown',
        classColor: ct?.color ?? '#ccc',
        checkInTime: att?.checkInTime ?? null,
      };
    });

    return HttpResponse.json({ success: true, data: enriched });
  }),

  http.post('/api/admin/attendance/check-in', async ({ request }) => {
    const { bookingId } = (await request.json()) as { bookingId: string };
    const bIdx = bookingStore.findIndex((b) => b.id === bookingId);
    if (bIdx === -1)
      return HttpResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });

    bookingStore[bIdx] = { ...bookingStore[bIdx], status: 'attended' };

    const now = new Date();
    const record = {
      id: `att-${String(attStore.length + 1).padStart(3, '0')}`,
      bookingId,
      userId: bookingStore[bIdx].userId ?? '',
      date: bookingStore[bIdx].date,
      checkInTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      createdAt: now.toISOString(),
    };
    attStore.push(record);
    return HttpResponse.json({ success: true, data: record }, { status: 201 });
  }),

  http.get('/api/admin/attendance/report', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    let result = attStore;
    if (from) result = result.filter((r) => r.date >= from);
    if (to) result = result.filter((r) => r.date <= to);

    const enriched = result.map((r) => {
      const user = customerUsers.find((u) => u.id === r.userId);
      const b = bookingStore.find((bk) => bk.id === r.bookingId);
      const ct = classTypes.find((c) => b && c.id === b.classTypeId);
      return {
        ...r,
        customerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        className: ct?.name ?? 'Unknown',
        classColor: ct?.color ?? '#ccc',
      };
    });

    return HttpResponse.json({
      success: true,
      data: { total: enriched.length, records: enriched },
    });
  }),

  http.get('/api/admin/session-usage', () => {
    const usage = customerUsers.map((u) => {
      const sub = customerSubscriptions.find((s) => s.userId === u.id);
      const pointCards = pointCardPurchases.filter((p) => p.userId === u.id);
      const subPlan = sub ? subscriptionPlans.find((p) => p.id === sub.planId) : null;

      return {
        userId: u.id,
        customerName: `${u.firstName} ${u.lastName}`,
        subscription: sub
          ? {
              planName: subPlan?.name ?? 'Unknown',
              sessionsUsed: sub.sessionsUsed,
              sessionsLimit: sub.sessionsLimit,
              status: sub.status,
            }
          : null,
        pointCards: pointCards.map((pc) => {
          const plan = pointCardPlans.find((p) => p.id === pc.planId);
          return {
            planName: plan?.name ?? 'Unknown',
            sessionsRemaining: pc.sessionsRemaining,
            totalSessions: plan?.sessionsCount ?? 0,
            expiresAt: pc.expiresAt,
          };
        }),
      };
    });

    return HttpResponse.json({ success: true, data: usage });
  }),
];
