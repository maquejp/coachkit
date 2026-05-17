import { useEffect, useState, useCallback } from 'react';
import type { AdminSettings } from '@/api/admin';
import { fetchSettings, updateSettings } from '@/api/admin';

interface UseSettingsResult {
  data: AdminSettings | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  update: (settings: Partial<AdminSettings>) => Promise<void>;
  saving: boolean;
}

export function useSettings(): UseSettingsResult {
  const [data, setData] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchSettings();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const update = useCallback(async (settings: Partial<AdminSettings>) => {
    setSaving(true);
    setError(null);
    try {
      const result = await updateSettings(settings);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update settings');
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  return { data, loading, error, refetch: fetch, update, saving };
}
