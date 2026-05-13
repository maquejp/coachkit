import { http, HttpResponse } from 'msw';
import {
  subscriptionPlans,
  pointCardPlans,
  customerSubscriptions,
  pointCardPurchases,
  classTypes,
} from '@/mocks/fixtures';

const subStore = [...customerSubscriptions];
const pcStore = [...pointCardPurchases];

export const subscriptionHandlers = [
  http.get('/api/subscription-plans', () => {
    return HttpResponse.json({ success: true, data: subscriptionPlans });
  }),

  http.get('/api/subscription-plans/:id', ({ params }) => {
    const plan = subscriptionPlans.find((p) => p.id === params.id);
    if (!plan) return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: plan });
  }),

  http.get('/api/customer-subscriptions', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    let result = subStore;
    if (userId) result = result.filter((s) => s.userId === userId);
    return HttpResponse.json({ success: true, data: result });
  }),

  http.post('/api/customer-subscriptions', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const sub = {
      id: `cs-${String(subStore.length + 1).padStart(3, '0')}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as (typeof subStore)[0];
    subStore.push(sub);
    return HttpResponse.json({ success: true, data: sub }, { status: 201 });
  }),

  http.put('/api/customer-subscriptions/:id/change-plan', async ({ params, request }) => {
    const idx = subStore.findIndex((s) => s.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    const body = (await request.json()) as { planId: string };
    subStore[idx] = { ...subStore[idx], planId: body.planId, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ success: true, data: subStore[idx] });
  }),

  http.post('/api/customer-subscriptions/:id/cancel', ({ params }) => {
    const idx = subStore.findIndex((s) => s.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    subStore[idx] = {
      ...subStore[idx],
      status: 'cancelled',
      endDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ success: true, data: subStore[idx] });
  }),

  http.get('/api/point-card-plans', () => {
    return HttpResponse.json({ success: true, data: pointCardPlans });
  }),

  http.get('/api/point-card-plans/:id', ({ params }) => {
    const plan = pointCardPlans.find((p) => p.id === params.id);
    if (!plan) return HttpResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return HttpResponse.json({ success: true, data: plan });
  }),

  http.get('/api/point-card-purchases', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    let result = pcStore;
    if (userId) result = result.filter((p) => p.userId === userId);
    return HttpResponse.json({ success: true, data: result });
  }),

  http.post('/api/point-card-purchases', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const purchase = {
      id: `pc-${String(pcStore.length + 1).padStart(3, '0')}`,
      ...body,
      purchasedAt: new Date().toISOString(),
    } as (typeof pcStore)[0];
    pcStore.push(purchase);
    return HttpResponse.json({ success: true, data: purchase }, { status: 201 });
  }),

  http.get('/api/single-session-pricing', ({ request }) => {
    const url = new URL(request.url);
    const classTypeId = url.searchParams.get('classTypeId');
    let result = classTypes.map((ct) => ({ classTypeId: ct.id, priceCents: ct.defaultPriceCents }));
    if (classTypeId) result = result.filter((r) => r.classTypeId === classTypeId);
    return HttpResponse.json({ success: true, data: result });
  }),
];
