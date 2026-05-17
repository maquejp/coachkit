import { useEffect, useState, useCallback } from 'react';
import type { ScheduleExceptionItem } from '@/api/admin';
import { fetchScheduleExceptions } from '@/api/admin';

interface UseScheduleExceptionsResult {
  data: ScheduleExceptionItem[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useScheduleExceptions(locationId?: string): UseScheduleExceptionsResult {
  const [data, setData] = useState<ScheduleExceptionItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchScheduleExceptions(locationId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load schedule exceptions');
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
