import { useEffect, useState, useCallback } from 'react';
import type { SubscriptionPlan } from '@/types';
import {
  fetchSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from '@/api/admin';

interface UseSubscriptionPlansResult {
  data: SubscriptionPlan[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  create: (
    item: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<SubscriptionPlan | null>;
  update: (
    id: string,
    item: Partial<Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => Promise<SubscriptionPlan | null>;
  remove: (id: string) => Promise<boolean>;
  saving: boolean;
}

export function useSubscriptionPlans(): UseSubscriptionPlansResult {
  const [data, setData] = useState<SubscriptionPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSubscriptionPlans();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const create = useCallback(
    async (item: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
      setSaving(true);
      try {
        const result = await createSubscriptionPlan(item);
        setData((prev) => (prev ? [...prev, result] : [result]));
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to create subscription plan');
        return null;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: string, item: Partial<Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>>) => {
      setSaving(true);
      try {
        const result = await updateSubscriptionPlan(id, item);
        setData((prev) => prev?.map((p) => (p.id === id ? result : p)) ?? null);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update subscription plan');
        return null;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    setSaving(true);
    try {
      await deleteSubscriptionPlan(id);
      setData((prev) => prev?.filter((p) => p.id !== id) ?? null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete subscription plan');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, error, refetch: fetch, create, update, remove, saving };
}
