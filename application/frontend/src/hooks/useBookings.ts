import { useEffect, useState, useCallback } from 'react';
import type { Booking } from '@/types';
import { fetchMyBookingsApi, cancelBookingApi, rescheduleBookingApi } from '@/api/customer';

interface UseBookingsResult {
  data: Booking[] | null;
  total: number;
  totalPages: number;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  cancelBooking: (id: string) => Promise<void>;
  rescheduleBooking: (id: string, date: string) => Promise<void>;
}

export function useBookings(userId: string | undefined): UseBookingsResult {
  const [data, setData] = useState<Booking[] | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyBookingsApi(userId, page, pageSize);
      setData(result.items);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [userId, page, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  const cancelBooking = useCallback(async (id: string) => {
    await cancelBookingApi(id);
    setData((prev) => prev?.filter((b) => b.id !== id) ?? null);
  }, []);

  const rescheduleBooking = useCallback(async (id: string, date: string) => {
    const updated = await rescheduleBookingApi(id, date);
    setData((prev) => prev?.map((b) => (b.id === id ? updated : b)) ?? null);
  }, []);

  return {
    data,
    total,
    totalPages,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading,
    error,
    refetch: fetch,
    cancelBooking,
    rescheduleBooking,
  };
}
