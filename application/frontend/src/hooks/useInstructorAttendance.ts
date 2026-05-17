import { useEffect, useState, useCallback } from 'react';
import type { InstructorBooking } from '@/api/instructor';
import { fetchInstructorAttendanceBookings } from '@/api/instructor';
import apiClient from '@/api/client';

interface UseInstructorAttendanceResult {
  data: InstructorBooking[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  markAttendance: (
    bookingId: string,
    status: 'attended' | 'absent' | 'cancelled',
  ) => Promise<boolean>;
  marking: boolean;
}

export function useInstructorAttendance(
  scheduleId: string,
  date: string,
): UseInstructorAttendanceResult {
  const [data, setData] = useState<InstructorBooking[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchInstructorAttendanceBookings(scheduleId, date);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load attendance');
    } finally {
      setLoading(false);
    }
  }, [scheduleId, date]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const markAttendance = useCallback(
    async (bookingId: string, status: 'attended' | 'absent' | 'cancelled') => {
      setMarking(true);
      try {
        await apiClient.post(`/instructor/attendance/${bookingId}`, { status });
        setData((prev) => prev?.map((b) => (b.id === bookingId ? { ...b, status } : b)) ?? null);
        return true;
      } catch {
        setError('Failed to mark attendance');
        return false;
      } finally {
        setMarking(false);
      }
    },
    [],
  );

  return { data, loading, error, refetch: fetch, markAttendance, marking };
}
