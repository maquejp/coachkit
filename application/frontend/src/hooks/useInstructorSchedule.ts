import { useEffect, useState, useCallback } from 'react';
import type { InstructorScheduleItem } from '@/api/instructor';
import type { ClassType, Location } from '@/types';
import { fetchInstructorSchedule } from '@/api/instructor';
import { fetchAllClassTypes, fetchAllLocations } from '@/api/admin';

interface UseInstructorScheduleResult {
  schedules: InstructorScheduleItem[];
  classTypes: ClassType[];
  locations: Location[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useInstructorSchedule(coachId: string | null): UseInstructorScheduleResult {
  const [schedules, setSchedules] = useState<InstructorScheduleItem[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
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
      const [sched, cts, locs] = await Promise.all([
        fetchInstructorSchedule(coachId),
        fetchAllClassTypes(),
        fetchAllLocations(),
      ]);
      setSchedules(sched);
      setClassTypes(cts);
      setLocations(locs);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load schedule');
    } finally {
      setLoading(false);
    }
  }, [coachId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return { schedules, classTypes, locations, loading, error, refetch: fetch };
}
