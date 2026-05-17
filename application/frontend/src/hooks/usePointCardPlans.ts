import { useEffect, useState, useCallback } from 'react';
import type { PointCardPlan } from '@/types';
import {
  fetchPointCardPlans,
  createPointCardPlan,
  updatePointCardPlan,
  deletePointCardPlan,
} from '@/api/admin';

interface UsePointCardPlansResult {
  data: PointCardPlan[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  create: (
    item: Omit<PointCardPlan, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<PointCardPlan | null>;
  update: (
    id: string,
    item: Partial<Omit<PointCardPlan, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => Promise<PointCardPlan | null>;
  remove: (id: string) => Promise<boolean>;
  saving: boolean;
}

export function usePointCardPlans(): UsePointCardPlansResult {
  const [data, setData] = useState<PointCardPlan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPointCardPlans();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load point card plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const create = useCallback(
    async (item: Omit<PointCardPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
      setSaving(true);
      try {
        const result = await createPointCardPlan(item);
        setData((prev) => (prev ? [...prev, result] : [result]));
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to create plan');
        return null;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (id: string, item: Partial<Omit<PointCardPlan, 'id' | 'createdAt' | 'updatedAt'>>) => {
      setSaving(true);
      try {
        const result = await updatePointCardPlan(id, item);
        setData((prev) => prev?.map((p) => (p.id === id ? result : p)) ?? null);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update plan');
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
      await deletePointCardPlan(id);
      setData((prev) => prev?.filter((p) => p.id !== id) ?? null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete plan');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, error, refetch: fetch, create, update, remove, saving };
}
