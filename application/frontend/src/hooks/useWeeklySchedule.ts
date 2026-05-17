import { useEffect, useState, useCallback } from 'react';
import type { WeeklyScheduleItem } from '@/api/admin';
import {
  fetchWeeklySchedule,
  createWeeklySchedule,
  updateWeeklySchedule,
  deleteWeeklySchedule,
} from '@/api/admin';

interface UseWeeklyScheduleResult {
  data: WeeklyScheduleItem[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  create: (item: Parameters<typeof createWeeklySchedule>[0]) => Promise<WeeklyScheduleItem>;
  update: (
    id: string,
    item: Parameters<typeof updateWeeklySchedule>[1],
  ) => Promise<WeeklyScheduleItem>;
  remove: (id: string) => Promise<void>;
}

export function useWeeklySchedule(day?: number): UseWeeklyScheduleResult {
  const [data, setData] = useState<WeeklyScheduleItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchWeeklySchedule(day);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  }, [day]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const create = useCallback(async (item: Parameters<typeof createWeeklySchedule>[0]) => {
    const result = await createWeeklySchedule(item);
    setData((prev) => (prev ? [...prev, result] : [result]));
    return result;
  }, []);

  const update = useCallback(
    async (id: string, item: Parameters<typeof updateWeeklySchedule>[1]) => {
      const result = await updateWeeklySchedule(id, item);
      setData((prev) => prev?.map((s) => (s.id === id ? result : s)) ?? null);
      return result;
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    await deleteWeeklySchedule(id);
    setData((prev) => prev?.filter((s) => s.id !== id) ?? null);
  }, []);

  return { data, loading, error, refetch: fetch, create, update, remove };
}
