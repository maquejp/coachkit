import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useContactForm } from '@/hooks/useContactForm';
import apiClient from '@/api/client';

vi.mock('@/api/client', () => ({ default: { post: vi.fn() } }));

describe('useContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits contact form successfully', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });
    const { result } = renderHook(() => useContactForm());

    const ok = await act(async () =>
      result.current.submit({ name: 'Test', email: 'test@test.com', message: 'Hello' }),
    );

    expect(ok).toBe(true);
    expect(result.current.submitting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error on failure', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useContactForm());

    await act(async () => {
      try {
        await result.current.submit({ name: 'Test', email: 'test@test.com', message: 'Hello' });
      } catch {
        /* expected */
      }
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.submitting).toBe(false);
  });

  it('submits with phone number', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });
    const { result } = renderHook(() => useContactForm());

    const ok = await act(async () =>
      result.current.submit({ name: 'Test', email: 't@t.com', phone: '+123', message: 'Hi' }),
    );
    expect(ok).toBe(true);
    expect(apiClient.post).toHaveBeenCalledWith('/contact', {
      name: 'Test',
      email: 't@t.com',
      phone: '+123',
      message: 'Hi',
    });
  });

  it('re-throws error for caller handling', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Fail'));
    const { result } = renderHook(() => useContactForm());

    await expect(
      act(async () => result.current.submit({ name: 'T', email: 't@t.com', message: 'M' })),
    ).rejects.toThrow('Fail');
  });
});
