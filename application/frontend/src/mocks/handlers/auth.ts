import { http, HttpResponse } from 'msw';
import { allUsers, adminUser } from '@/mocks/fixtures';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };
    const user = allUsers.find((u) => u.email === email);
    if (!user)
      return HttpResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    return HttpResponse.json({ success: true, data: { user, token: `mock-token-${user.id}` } });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        success: true,
        data: { user: { ...body, id: 'user-new', role: 'customer' }, token: 'mock-token-new' },
      },
      { status: 201 },
    );
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({ success: true, data: adminUser });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true, data: null });
  }),
];
