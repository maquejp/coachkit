import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/api/client';
import { loginApi, registerApi, meApi, logoutApi } from '@/api/auth';

vi.mock('@/api/client', () => ({ default: { post: vi.fn(), get: vi.fn() } }));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('auth API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({ ok: true });
  });

  it('loginApi fetches csrf cookie then posts', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: true, data: { user: { id: '1' }, token: 'tok' } },
    });

    const result = await loginApi({ email: 'a@b.com', password: 'secret' });

    expect(mockFetch).toHaveBeenCalledWith('/sanctum/csrf-cookie', { credentials: 'include' });
    expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'a@b.com',
      password: 'secret',
    });
    expect(result.data.user.id).toBe('1');
  });

  it('registerApi posts to auth/register', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: true, data: { user: { id: '2' }, token: 'tok' } },
    });

    const result = await registerApi({
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      password: 'p',
    });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      password: 'p',
    });
    expect(result.data.user.id).toBe('2');
  });

  it('meApi gets current user', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { success: true, data: { id: '1', role: 'admin' } },
    });

    const result = await meApi();

    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
    expect(result.data.id).toBe('1');
  });

  it('logoutApi posts to auth/logout', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });

    const result = await logoutApi();

    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    expect(result.success).toBe(true);
  });
});
