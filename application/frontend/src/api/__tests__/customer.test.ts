import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/api/client';
import {
  fetchSubscriptionPlansApi,
  fetchPointCardPlansApi,
  updateProfileApi,
  changePasswordApi,
  deleteAccountApi,
} from '@/api/customer';

vi.mock('@/api/client', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe('customer API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchSubscriptionPlansApi gets plans', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { success: true, data: [{ id: 'p1' }] } });
    const result = await fetchSubscriptionPlansApi();
    expect(apiClient.get).toHaveBeenCalledWith('/subscription-plans');
    expect(result).toEqual([{ id: 'p1' }]);
  });

  it('fetchPointCardPlansApi gets plans', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: { success: true, data: [{ id: 'pc1' }] } });
    const result = await fetchPointCardPlansApi();
    expect(apiClient.get).toHaveBeenCalledWith('/point-card-plans');
    expect(result).toEqual([{ id: 'pc1' }]);
  });

  it('updateProfileApi puts profile update', async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: { success: true, data: {} } });
    await updateProfileApi({ name: 'New' });
    expect(apiClient.put).toHaveBeenCalledWith('/profile', { name: 'New' });
  });

  it('changePasswordApi puts password change', async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: { success: true } });
    await changePasswordApi('old', 'new');
    expect(apiClient.put).toHaveBeenCalledWith('/profile/password', {
      currentPassword: 'old',
      newPassword: 'new',
    });
  });

  it('deleteAccountApi deletes account', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ data: { success: true } });
    await deleteAccountApi();
    expect(apiClient.delete).toHaveBeenCalledWith('/profile');
  });
});
