import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAttendance } from '@/hooks/useAttendance';

const mockFetchCheckInBookings = vi.fn();
const mockCheckInBooking = vi.fn();
const mockFetchAttendanceReport = vi.fn();
const mockFetchCustomerAttendanceFn = vi.fn();

vi.mock('@/api/admin', () => ({
  fetchCheckInBookings: (...args: unknown[]) => mockFetchCheckInBookings(...args),
  checkInBooking: (...args: unknown[]) => mockCheckInBooking(...args),
  fetchAttendanceReport: (...args: unknown[]) => mockFetchAttendanceReport(...args),
  fetchCustomerAttendance: (...args: unknown[]) => mockFetchCustomerAttendanceFn(...args),
}));

const sampleBookings = [
  { id: 'b1', userId: 'u1', date: '2026-05-16', status: 'confirmed' as const },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockFetchCheckInBookings.mockResolvedValue(sampleBookings);
  mockFetchAttendanceReport.mockResolvedValue({
    items: [],
    total: 0,
    totalPages: 0,
    page: 1,
    pageSize: 20,
  });
  mockFetchCustomerAttendanceFn.mockResolvedValue({ items: [] });
});

describe('useAttendance', () => {
  it('fetches check-in bookings on mount', async () => {
    const { result } = renderHook(() => useAttendance());

    await waitFor(() => expect(result.current.checkInLoading).toBe(false));

    expect(mockFetchCheckInBookings).toHaveBeenCalledTimes(1);
    expect(result.current.checkInBookings).toEqual(sampleBookings);
  });

  it('sets error when check-in fetch fails', async () => {
    mockFetchCheckInBookings.mockRejectedValue(new Error('Fetch failed'));
    const { result } = renderHook(() => useAttendance());

    await waitFor(() => expect(result.current.checkInLoading).toBe(false));

    expect(result.current.error).toBe('Fetch failed');
  });

  it('checkIn updates booking state', async () => {
    mockFetchCheckInBookings.mockResolvedValue(sampleBookings);
    mockCheckInBooking.mockResolvedValue({ checkInTime: '2026-05-16T10:00:00Z' });
    const { result } = renderHook(() => useAttendance());

    await waitFor(() => expect(result.current.checkInLoading).toBe(false));

    await act(async () => {
      const success = await result.current.checkIn('b1');
      expect(success).toBe(true);
    });

    expect(mockCheckInBooking).toHaveBeenCalledWith('b1');
    expect(result.current.checkInBookings?.[0]).toHaveProperty(
      'checkInTime',
      '2026-05-16T10:00:00Z',
    );
  });

  it('checkIn returns false and sets error on failure', async () => {
    mockCheckInBooking.mockRejectedValue(new Error('Check-in failed'));
    const { result } = renderHook(() => useAttendance());

    await waitFor(() => expect(result.current.checkInLoading).toBe(false));

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.checkIn('b1');
    });

    expect(success).toBe(false);
    expect(result.current.error).toBe('Failed to check in');
  });

  it('fetchReport fetches attendance report', async () => {
    mockFetchAttendanceReport.mockResolvedValue({
      items: [{ id: 1 }],
      total: 1,
      totalPages: 1,
      page: 1,
      pageSize: 20,
    });
    const { result } = renderHook(() => useAttendance());

    await act(() => result.current.fetchReport('2026-01-01', '2026-01-31'));

    expect(mockFetchAttendanceReport).toHaveBeenCalledWith('2026-01-01', '2026-01-31', 1, 20);
    await waitFor(() => expect(result.current.reportLoading).toBe(false));
    expect(result.current.reportData?.total).toBe(1);
  });

  it('fetchReport sets error on failure', async () => {
    mockFetchAttendanceReport.mockRejectedValue(new Error('Report error'));
    const { result } = renderHook(() => useAttendance());

    await act(() => result.current.fetchReport('2026-01-01', '2026-01-31'));

    await waitFor(() => expect(result.current.reportLoading).toBe(false));
    expect(result.current.error).toBe('Report error');
  });

  it('fetchCustomerAttendance fetches customer data', async () => {
    mockFetchCustomerAttendanceFn.mockResolvedValue({ items: [{ id: 'a1', date: '2026-01-15' }] });
    const { result } = renderHook(() => useAttendance());

    await act(() => result.current.fetchCustomerAttendance('u1'));

    expect(mockFetchCustomerAttendanceFn).toHaveBeenCalledWith('u1');
    await waitFor(() => expect(result.current.customerAttendanceLoading).toBe(false));
    expect(result.current.customerAttendance).toEqual([{ id: 'a1', date: '2026-01-15' }]);
  });

  it('combined loading reflects checkInLoading', () => {
    mockFetchCheckInBookings.mockReturnValue(new Promise(() => {})); // never resolves
    const { result } = renderHook(() => useAttendance());

    expect(result.current.loading).toBe(true);
  });

  it('refetchCheckIns re-fetches check-in bookings', async () => {
    const { result } = renderHook(() => useAttendance());

    await waitFor(() => expect(result.current.checkInLoading).toBe(false));
    expect(mockFetchCheckInBookings).toHaveBeenCalledTimes(1);

    mockFetchCheckInBookings.mockResolvedValue([{ id: 'b2' }]);
    await act(() => {
      result.current.refetchCheckIns();
    });

    await waitFor(() => expect(mockFetchCheckInBookings).toHaveBeenCalledTimes(2));
    expect(result.current.checkInBookings).toEqual([{ id: 'b2' }]);
  });
});
