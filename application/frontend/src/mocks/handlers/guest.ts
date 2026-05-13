import { http, HttpResponse } from 'msw';
import { freeSessionClaims } from '@/mocks/fixtures';
import { allUsers } from '@/mocks/fixtures';

const claims = [...freeSessionClaims];

export const guestHandlers = [
  http.get('/api/free-session-claims/check', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    if (!email)
      return HttpResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    const existing = claims.find((c) => c.email === email);
    return HttpResponse.json({
      success: true,
      data: {
        claimed: !!existing,
        claim: existing ?? null,
      },
    });
  }),

  http.post('/api/free-session-claims', async ({ request }) => {
    const { email, bookingId } = (await request.json()) as {
      email: string;
      bookingId: string;
    };
    const existing = claims.find((c) => c.email === email);
    if (existing)
      return HttpResponse.json(
        { success: false, error: 'Email already claimed a free session' },
        { status: 409 },
      );
    const claim = {
      id: `fsc-${String(claims.length + 1).padStart(3, '0')}`,
      email,
      userId: null,
      bookingId,
      claimedAt: new Date().toISOString(),
      activatedAt: null,
    };
    claims.push(claim);
    return HttpResponse.json({ success: true, data: claim }, { status: 201 });
  }),

  http.post('/api/guest/register', async ({ request }) => {
    const body = (await request.json()) as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      claimId: string;
    };
    const claim = claims.find((c) => c.id === body.claimId);
    if (!claim)
      return HttpResponse.json({ success: false, error: 'Claim not found' }, { status: 404 });
    if (claim.activatedAt)
      return HttpResponse.json(
        { success: false, error: 'Claim already activated' },
        { status: 409 },
      );
    if (claim.email !== body.email)
      return HttpResponse.json(
        { success: false, error: 'Email does not match claim' },
        { status: 400 },
      );
    const user = {
      id: `user-${String(allUsers.length + 1).padStart(3, '0')}`,
      email: body.email,
      role: 'customer' as const,
      firstName: body.firstName,
      lastName: body.lastName,
      emailVerifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    claim.userId = user.id;
    claim.activatedAt = new Date().toISOString();
    return HttpResponse.json(
      { success: true, data: { user, token: `mock-token-${user.id}` } },
      { status: 201 },
    );
  }),
];
