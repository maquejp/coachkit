import { useEffect, useState, useCallback } from 'react';
import type { EnrichedWaitlistEntry } from '@/api/admin';
import {
  fetchAdminWaitlist,
  promoteWaitlistEntry,
  removeWaitlistEntry,
  notifyAllWaitlist,
} from '@/api/admin';

interface UseWaitlistResult {
  data: EnrichedWaitlistEntry[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  promote: (id: string) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
  notifyAll: (
    scheduleId: string,
    date: string,
  ) => Promise<{ notified: number; message: string } | null>;
  saving: boolean;
}

export function useWaitlist(scheduleId?: string, date?: string): UseWaitlistResult {
  const [data, setData] = useState<EnrichedWaitlistEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAdminWaitlist(scheduleId, date);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  }, [scheduleId, date]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const promote = useCallback(async (id: string) => {
    setSaving(true);
    try {
      await promoteWaitlistEntry(id);
      setData((prev) => prev?.map((e) => (e.id === id ? { ...e, status: 'promoted' } : e)) ?? null);
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setSaving(true);
    try {
      await removeWaitlistEntry(id);
      setData((prev) => prev?.filter((e) => e.id !== id) ?? null);
      return true;
    } catch {
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const notifyAll = useCallback(async (sid: string, d: string) => {
    setSaving(true);
    try {
      const result = await notifyAllWaitlist(sid, d);
      return result;
    } catch {
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, error, refetch: fetch, promote, remove, notifyAll, saving };
}
