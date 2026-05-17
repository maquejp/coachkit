import { useEffect, useState, useCallback } from 'react';
import type { CheckInBooking, AttendanceReportRecord } from '@/api/admin';
import {
  fetchCheckInBookings,
  checkInBooking,
  fetchAttendanceReport,
  fetchCustomerAttendance,
} from '@/api/admin';
import type { CustomerAttendanceDetail } from '@/api/admin';

interface UseAttendanceResult {
  data: {
    checkInBookings: CheckInBooking[] | null;
    reportData: {
      total: number;
      items: AttendanceReportRecord[];
      totalPages: number;
      page: number;
      pageSize: number;
    } | null;
    customerAttendance: CustomerAttendanceDetail[] | null;
  };
  loading: boolean;
  error: string | null;
  refetch: () => void;
  checkInBookings: CheckInBooking[] | null;
  checkInLoading: boolean;
  reportData: {
    total: number;
    items: AttendanceReportRecord[];
    totalPages: number;
    page: number;
    pageSize: number;
  } | null;
  reportLoading: boolean;
  customerAttendance: CustomerAttendanceDetail[] | null;
  customerAttendanceLoading: boolean;
  refetchCheckIns: () => void;
  refetchReport: () => void;
  checkIn: (bookingId: string) => Promise<boolean>;
  checkingIn: boolean;
  fetchReport: (from: string, to: string, page?: number) => Promise<void>;
  fetchCustomerAttendance: (customerId: string) => Promise<void>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  reportPage: number;
  setReportPage: (p: number) => void;
  reportFrom: string;
  reportTo: string;
}

export function useAttendance(): UseAttendanceResult {
  const [checkInBookings, setCheckInBookings] = useState<CheckInBooking[] | null>(null);
  const [checkInLoading, setCheckInLoading] = useState(true);
  const [reportData, setReportData] = useState<{
    total: number;
    items: AttendanceReportRecord[];
    totalPages: number;
    page: number;
    pageSize: number;
  } | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportPage, setReportPage] = useState(1);
  const [reportPageSize] = useState(20);
  const [customerAttendance, setCustomerAttendance] = useState<CustomerAttendanceDetail[] | null>(
    null,
  );
  const [customerAttendanceLoading, setCustomerAttendanceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [reportFrom, setReportFrom] = useState('');
  const [reportTo, setReportTo] = useState('');

  const fetchCheckIns = useCallback(async () => {
    setCheckInLoading(true);
    setError(null);
    try {
      const result = await fetchCheckInBookings(selectedDate);
      setCheckInBookings(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load check-in bookings');
    } finally {
      setCheckInLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCheckIns();
  }, [fetchCheckIns]);

  const checkIn = useCallback(async (bookingId: string) => {
    setCheckingIn(true);
    try {
      const result = await checkInBooking(bookingId);
      setCheckInBookings(
        (prev) =>
          prev?.map((b) => (b.id === bookingId ? { ...b, checkInTime: result.checkInTime } : b)) ??
          null,
      );
      return true;
    } catch {
      setError('Failed to check in');
      return false;
    } finally {
      setCheckingIn(false);
    }
  }, []);

  const fetchReport = useCallback(
    async (from: string, to: string, p = 1) => {
      setReportLoading(true);
      setError(null);
      setReportFrom(from);
      setReportTo(to);
      try {
        const result = await fetchAttendanceReport(from, to, p, reportPageSize);
        setReportData(result);
        setReportPage(p);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load attendance report');
      } finally {
        setReportLoading(false);
      }
    },
    [reportPageSize],
  );

  const fetchCustAttendance = useCallback(async (customerId: string) => {
    setCustomerAttendanceLoading(true);
    setError(null);
    try {
      const result = await fetchCustomerAttendance(customerId);
      setCustomerAttendance(result.items ?? result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load customer attendance');
    } finally {
      setCustomerAttendanceLoading(false);
    }
  }, []);

  const loading = checkInLoading || reportLoading || customerAttendanceLoading;

  return {
    data: { checkInBookings, reportData, customerAttendance },
    loading,
    error,
    refetch: fetchCheckIns,
    checkInBookings,
    checkInLoading,
    reportData,
    reportLoading,
    customerAttendance,
    customerAttendanceLoading,
    refetchCheckIns: fetchCheckIns,
    refetchReport: () => {
      if (reportFrom && reportTo) fetchReport(reportFrom, reportTo, reportPage);
    },
    checkIn,
    checkingIn,
    fetchReport,
    fetchCustomerAttendance: fetchCustAttendance,
    selectedDate,
    setSelectedDate,
    reportPage,
    setReportPage,
    reportFrom,
    reportTo,
  };
}
