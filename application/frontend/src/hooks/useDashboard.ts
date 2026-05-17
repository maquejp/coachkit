import { useEffect, useState, useCallback } from 'react';
import type { Kpis, ChartsData, OccupancyData } from '@/api/admin';
import { fetchDashboardKpis, fetchDashboardCharts, fetchDashboardOccupancy } from '@/api/admin';

interface UseDashboardResult {
  kpis: Kpis | null;
  charts: ChartsData | null;
  occupancy: OccupancyData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(): UseDashboardResult {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [charts, setCharts] = useState<ChartsData | null>(null);
  const [occupancy, setOccupancy] = useState<OccupancyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [k, c, o] = await Promise.all([
        fetchDashboardKpis(),
        fetchDashboardCharts(),
        fetchDashboardOccupancy(),
      ]);
      setKpis(k);
      setCharts(c);
      setOccupancy(o);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { kpis, charts, occupancy, loading, error, refetch: fetch };
}
