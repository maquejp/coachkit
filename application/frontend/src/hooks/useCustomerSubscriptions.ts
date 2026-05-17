import { useEffect, useState, useCallback } from 'react';
import type { CustomerSubscription } from '@/types';
import {
  fetchMySubscriptionsApi,
  cancelSubscriptionApi,
  changeSubscriptionPlanApi,
} from '@/api/customer';

interface UseCustomerSubscriptionsResult {
  data: CustomerSubscription[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  cancel: (id: string) => Promise<void>;
  changePlan: (id: string, planId: string) => Promise<void>;
}

export function useCustomerSubscriptions(
  userId: string | undefined,
): UseCustomerSubscriptionsResult {
  const [data, setData] = useState<CustomerSubscription[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMySubscriptionsApi(userId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const cancel = useCallback(async (id: string) => {
    await cancelSubscriptionApi(id);
    setData((prev) => prev?.map((s) => (s.id === id ? { ...s, status: 'cancelled' } : s)) ?? null);
  }, []);

  const changePlan = useCallback(
    async (id: string, planId: string) => {
      await changeSubscriptionPlanApi(id, planId);
      await fetch();
    },
    [fetch],
  );

  return { data, loading, error, refetch: fetch, cancel, changePlan };
}
