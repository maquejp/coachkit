import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePayments } from '@/hooks/usePayments';
import apiClient from '@/api/client';

vi.mock('@/api/client', () => ({ default: { get: vi.fn(), post: vi.fn() } }));

describe('usePayments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches payment history', async () => {
    const mockHistory = [{ id: 'p1', amountCents: 1000 }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: { success: true, data: mockHistory } });

    const { result } = renderHook(() => usePayments());

    await act(async () => result.current.fetchHistory());

    expect(result.current.history).toEqual(mockHistory);
    expect(result.current.loading).toBe(false);
    expect(apiClient.get).toHaveBeenCalledWith('/payments/history');
  });

  it('handles fetch error', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Fetch failed'));

    const { result } = renderHook(() => usePayments());

    await act(async () => result.current.fetchHistory());

    expect(result.current.error).toBe('Fetch failed');
    expect(result.current.loading).toBe(false);
  });

  it('creates stripe setup intent', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: true, data: { clientSecret: 'cs_123' } },
    });

    const { result } = renderHook(() => usePayments());

    const secret = await act(async () => result.current.createStripeSetupIntent());

    expect(secret).toBe('cs_123');
    expect(apiClient.post).toHaveBeenCalledWith('/payments/stripe/create-setup-intent');
  });

  it('returns null on stripe setup intent failure', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => usePayments());

    const secret = await act(async () => result.current.createStripeSetupIntent());
    expect(secret).toBeNull();
  });

  it('creates stripe payment intent', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: true, data: { clientSecret: 'cs_456' } },
    });

    const { result } = renderHook(() => usePayments());

    const secret = await act(async () =>
      result.current.createStripePaymentIntent({ amount: 2000 }),
    );
    expect(secret).toBe('cs_456');
  });

  it('confirms payment', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => usePayments());

    const ok = await act(async () => result.current.confirmPayment({ paymentIntentId: 'pi_1' }));
    expect(ok).toBe(true);
  });

  it('returns false on confirm payment failure', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => usePayments());

    const ok = await act(async () => result.current.confirmPayment({}));
    expect(ok).toBe(false);
  });

  it('creates PayPal order', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: true, data: { orderId: 'ord_1' } },
    });

    const { result } = renderHook(() => usePayments());

    const orderId = await act(async () => result.current.createPayPalOrder({ amount: 5000 }));
    expect(orderId).toBe('ord_1');
  });

  it('captures PayPal order', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });

    const { result } = renderHook(() => usePayments());

    const ok = await act(async () => result.current.capturePayPalOrder({ orderId: 'ord_1' }));
    expect(ok).toBe(true);
  });
});
