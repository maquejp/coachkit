import { useEffect, useState, useCallback } from 'react';
import type { Location } from '@/types';
import { fetchAllLocations, createLocation, updateLocation, deleteLocation } from '@/api/admin';

interface UseLocationsResult {
  data: Location[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  create: (item: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Location | null>;
  update: (
    id: string,
    item: Partial<Omit<Location, 'id' | 'createdAt' | 'updatedAt'>>,
  ) => Promise<Location | null>;
  remove: (id: string) => Promise<boolean>;
  saving: boolean;
}

export function useLocations(): UseLocationsResult {
  const [data, setData] = useState<Location[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllLocations();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load locations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const create = useCallback(async (item: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>) => {
    setSaving(true);
    try {
      const result = await createLocation(item);
      setData((prev) => (prev ? [...prev, result] : [result]));
      return result;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create location');
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const update = useCallback(
    async (id: string, item: Partial<Omit<Location, 'id' | 'createdAt' | 'updatedAt'>>) => {
      setSaving(true);
      try {
        const result = await updateLocation(id, item);
        setData((prev) => prev?.map((l) => (l.id === id ? result : l)) ?? null);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update location');
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
      await deleteLocation(id);
      setData((prev) => prev?.filter((l) => l.id !== id) ?? null);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete location');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, error, refetch: fetch, create, update, remove, saving };
}
