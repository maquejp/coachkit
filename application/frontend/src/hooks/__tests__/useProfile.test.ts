import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProfile } from '@/hooks/useProfile';

const { mockUpdateProfileApi, mockChangePasswordApi, mockDeleteAccountApi } = vi.hoisted(() => ({
  mockUpdateProfileApi: vi.fn(),
  mockChangePasswordApi: vi.fn(),
  mockDeleteAccountApi: vi.fn(),
}));

vi.mock('@/api/customer', () => ({
  updateProfileApi: mockUpdateProfileApi,
  changePasswordApi: mockChangePasswordApi,
  deleteAccountApi: mockDeleteAccountApi,
}));

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates profile successfully', async () => {
    mockUpdateProfileApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.updateProfile({ name: 'New Name' });
    });

    expect(mockUpdateProfileApi).toHaveBeenCalledWith({ name: 'New Name' });
    expect(result.current.saving).toBe(false);
  });

  it('sets error and rethrows on update profile failure', async () => {
    mockUpdateProfileApi.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      try {
        await result.current.updateProfile({ name: 'Bad' });
      } catch {
        /* expected */
      }
    });

    expect(result.current.error).toBe('Update failed');
  });

  it('changes password successfully', async () => {
    mockChangePasswordApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.changePassword('old', 'new');
    });

    expect(mockChangePasswordApi).toHaveBeenCalledWith('old', 'new');
    expect(result.current.saving).toBe(false);
  });

  it('sets error on change password failure', async () => {
    mockChangePasswordApi.mockRejectedValue(new Error('Wrong password'));

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      try {
        await result.current.changePassword('old', 'new');
      } catch {
        /* expected */
      }
    });

    expect(result.current.error).toBe('Wrong password');
  });

  it('deletes account successfully', async () => {
    mockDeleteAccountApi.mockResolvedValue(undefined);

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.deleteAccount();
    });

    expect(mockDeleteAccountApi).toHaveBeenCalled();
    expect(result.current.saving).toBe(false);
  });

  it('sets error on delete account failure', async () => {
    mockDeleteAccountApi.mockRejectedValue(new Error('Delete failed'));

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      try {
        await result.current.deleteAccount();
      } catch {
        /* expected */
      }
    });

    expect(result.current.error).toBe('Delete failed');
  });
});
