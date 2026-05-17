import { useEffect, useState, useCallback } from 'react';
import type { ClassType } from '@/types';
import { fetchAllClassTypes, createClassType, updateClassType, deleteClassType } from '@/api/admin';

interface UseClassTypesResult {
  data: ClassType[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  create: (item: Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ClassType | null>;
  update: (
    id: string,
    item: Partial<Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => Promise<ClassType | null>;
  remove: (id: string) => Promise<boolean>;
  saving: boolean;
}

export function useClassTypes(): UseClassTypesResult {
  const [data, setData] = useState<ClassType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllClassTypes();
      setData(result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load class types');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const create = useCallback(async (item: Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'>) => {
    setSaving(true);
    try {
      const result = await createClassType(item);
      setData((prev) => (prev ? [...prev, result] : [result]));
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create class type');
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const update = useCallback(
    async (id: string, item: Partial<Omit<ClassType, 'id' | 'createdAt' | 'updatedAt'>>) => {
      setSaving(true);
      try {
        const result = await updateClassType(id, item);
        setData((prev) => prev?.map((c) => (c.id === id ? result : c)) ?? null);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update class type');
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
      await deleteClassType(id);
      setData((prev) => prev?.filter((c) => c.id !== id) ?? null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete class type');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, error, refetch: fetch, create, update, remove, saving };
}
