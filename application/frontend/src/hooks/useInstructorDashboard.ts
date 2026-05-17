import { useEffect, useState, useCallback } from 'react';
import type { InstructorStats, InstructorBooking } from '@/api/instructor';
import { fetchInstructorStats, fetchInstructorUpcoming } from '@/api/instructor';

interface UseInstructorDashboardResult {
  stats: InstructorStats | null;
  upcoming: InstructorBooking[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useInstructorDashboard(coachId: string | null): UseInstructorDashboardResult {
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [upcoming, setUpcoming] = useState<InstructorBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!coachId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [s, u] = await Promise.all([
        fetchInstructorStats(coachId),
        fetchInstructorUpcoming(coachId),
      ]);
      setStats(s);
      setUpcoming(u);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [coachId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { stats, upcoming, loading, error, refetch: fetch };
}
