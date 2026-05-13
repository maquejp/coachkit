import { http, HttpResponse } from 'msw';

export const paymentHandlers = [
  http.post('/api/payments/create-intent', async ({ request }) => {
    const { amountCents } = (await request.json()) as { amountCents: number };
    return HttpResponse.json({
      success: true,
      data: { clientSecret: `pi_mock_${Date.now()}_secret_abc123`, amountCents },
    });
  }),

  http.post('/api/payments/webhook', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, data: { received: true, event: body } });
  }),
];
