import { useState, useCallback } from 'react';
import apiClient from '@/api/client';
import type { PaymentTransaction } from '@/types';

interface UsePaymentsResult {
  data: PaymentTransaction[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  history: PaymentTransaction[];
  fetchHistory: () => Promise<void>;
  createStripeSetupIntent: () => Promise<string | null>;
  createStripePaymentIntent: (payload: Record<string, unknown>) => Promise<string | null>;
  confirmPayment: (payload: Record<string, unknown>) => Promise<boolean>;
  createPayPalOrder: (payload: Record<string, unknown>) => Promise<string | null>;
  capturePayPalOrder: (payload: Record<string, unknown>) => Promise<boolean>;
}

export function usePayments(): UsePaymentsResult {
  const [history, setHistory] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get<{ success: boolean; data: PaymentTransaction[] }>(
        '/payments/history',
      );
      setHistory(data.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  }, []);

  const createStripeSetupIntent = useCallback(async () => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: { clientSecret: string } }>(
        '/payments/stripe/create-setup-intent',
      );
      return data.data.clientSecret;
    } catch {
      return null;
    }
  }, []);

  const createStripePaymentIntent = useCallback(async (payload: Record<string, unknown>) => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: { clientSecret: string } }>(
        '/payments/stripe/create-payment-intent',
        payload,
      );
      return data.data.clientSecret;
    } catch {
      return null;
    }
  }, []);

  const confirmPayment = useCallback(async (payload: Record<string, unknown>) => {
    try {
      await apiClient.post('/payments/stripe/confirm-payment', payload);
      return true;
    } catch {
      return false;
    }
  }, []);

  const createPayPalOrder = useCallback(async (payload: Record<string, unknown>) => {
    try {
      const { data } = await apiClient.post<{ success: boolean; data: { orderId: string } }>(
        '/payments/paypal/create-order',
        payload,
      );
      return data.data.orderId;
    } catch {
      return null;
    }
  }, []);

  const capturePayPalOrder = useCallback(async (payload: Record<string, unknown>) => {
    try {
      await apiClient.post('/payments/paypal/capture-order', payload);
      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    data: history,
    loading,
    error,
    refetch: fetchHistory,
    history,
    fetchHistory,
    createStripeSetupIntent,
    createStripePaymentIntent,
    confirmPayment,
    createPayPalOrder,
    capturePayPalOrder,
  };
}
