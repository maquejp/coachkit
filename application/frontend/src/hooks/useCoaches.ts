import { useEffect, useState, useCallback } from 'react';
import type { Coach } from '@/types';
import { fetchAllCoaches, createCoach, updateCoach, deleteCoach } from '@/api/admin';

interface UseCoachesResult {
  data: Coach[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  create: (item: Omit<Coach, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Coach | null>;
  update: (
    id: string,
    item: Partial<Omit<Coach, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => Promise<Coach | null>;
  remove: (id: string) => Promise<boolean>;
  saving: boolean;
}

export function useCoaches(): UseCoachesResult {
  const [data, setData] = useState<Coach[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllCoaches();
      setData(result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load coaches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const create = useCallback(async (item: Omit<Coach, 'id' | 'createdAt' | 'updatedAt'>) => {
    setSaving(true);
    try {
      const result = await createCoach(item);
      setData((prev) => (prev ? [...prev, result] : [result]));
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create coach');
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const update = useCallback(
    async (id: string, item: Partial<Omit<Coach, 'id' | 'createdAt' | 'updatedAt'>>) => {
      setSaving(true);
      try {
        const result = await updateCoach(id, item);
        setData((prev) => prev?.map((c) => (c.id === id ? result : c)) ?? null);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update coach');
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
      await deleteCoach(id);
      setData((prev) => prev?.filter((c) => c.id !== id) ?? null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete coach');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, error, refetch: fetch, create, update, remove, saving };
}
