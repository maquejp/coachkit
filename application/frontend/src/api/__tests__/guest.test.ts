import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/api/client';
import { guestCheckClaimApi, guestCreateClaimApi, guestRegisterApi } from '@/api/guest';

vi.mock('@/api/client', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe('guest API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('guestCheckClaimApi checks claim by email', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { success: true, data: { claimed: false } },
    });
    const result = await guestCheckClaimApi('test@test.com');
    expect(apiClient.get).toHaveBeenCalledWith('/free-session-claims/check', {
      params: { email: 'test@test.com' },
    });
    expect(result.data.claimed).toBe(false);
  });

  it('guestCreateClaimApi creates claim', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true, data: { id: 'c1' } } });
    const result = await guestCreateClaimApi({ email: 'test@test.com', bookingId: 'b1' });
    expect(apiClient.post).toHaveBeenCalledWith('/free-session-claims', {
      email: 'test@test.com',
      bookingId: 'b1',
    });
    expect(result.data.id).toBe('c1');
  });

  it('guestRegisterApi registers guest', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: true, data: { user: { id: 'u1' }, token: 'tok' } },
    });
    const result = await guestRegisterApi({
      email: 'test@test.com',
      password: 'p',
      firstName: 'A',
      lastName: 'B',
      claimId: 'c1',
    });
    expect(apiClient.post).toHaveBeenCalledWith('/guest/register', {
      email: 'test@test.com',
      password: 'p',
      firstName: 'A',
      lastName: 'B',
      claimId: 'c1',
    });
    expect(result.data.user.id).toBe('u1');
  });
});
