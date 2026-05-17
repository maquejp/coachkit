import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useBookings } from '@/hooks/useBookings';

const mockFetchMyBookingsApi = vi.fn();
const mockCancelBookingApi = vi.fn();
const mockRescheduleBookingApi = vi.fn();

vi.mock('@/api/customer', () => ({
  fetchMyBookingsApi: (...args: unknown[]) => mockFetchMyBookingsApi(...args),
  cancelBookingApi: (...args: unknown[]) => mockCancelBookingApi(...args),
  rescheduleBookingApi: (...args: unknown[]) => mockRescheduleBookingApi(...args),
}));

const sampleBooking = {
  id: 'b1',
  userId: 'u1',
  guestEmail: null,
  classTypeId: 'ct1',
  scheduleId: 'ws1',
  date: '2026-06-01',
  status: 'confirmed' as const,
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-01T00:00:00Z',
  className: 'Morning Yoga',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useBookings', () => {
  it('starts in loading state with null data', () => {
    mockFetchMyBookingsApi.mockResolvedValue({
      items: [],
      total: 0,
      totalPages: 0,
      page: 1,
      pageSize: 20,
    });
    const { result } = renderHook(() => useBookings('u1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('fetches bookings on mount and sets data', async () => {
    mockFetchMyBookingsApi.mockResolvedValue({
      items: [sampleBooking],
      total: 1,
      totalPages: 1,
      page: 1,
      pageSize: 20,
    });
    const { result } = renderHook(() => useBookings('u1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([sampleBooking]);
    expect(result.current.total).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.error).toBeNull();
    expect(mockFetchMyBookingsApi).toHaveBeenCalledWith('u1', 1, 20);
  });

  it('sets error when API call fails', async () => {
    mockFetchMyBookingsApi.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useBookings('u1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('sets error message for non-Error rejections', async () => {
    mockFetchMyBookingsApi.mockRejectedValue('string error');
    const { result } = renderHook(() => useBookings('u1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to load bookings');
  });

  it('does not fetch when userId is undefined', async () => {
    const { result } = renderHook(() => useBookings(undefined));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockFetchMyBookingsApi).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
  });

  it('refetch repeats the API call', async () => {
    mockFetchMyBookingsApi.mockResolvedValue({
      items: [],
      total: 0,
      totalPages: 0,
      page: 1,
      pageSize: 20,
    });
    const { result } = renderHook(() => useBookings('u1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockFetchMyBookingsApi).toHaveBeenCalledTimes(1);

    mockFetchMyBookingsApi.mockResolvedValue({
      items: [sampleBooking],
      total: 1,
      totalPages: 1,
      page: 1,
      pageSize: 20,
    });
    await act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.data).toEqual([sampleBooking]));
    expect(mockFetchMyBookingsApi).toHaveBeenCalledTimes(2);
  });

  it('cancelBooking removes item from data', async () => {
    mockFetchMyBookingsApi.mockResolvedValue({
      items: [sampleBooking, { ...sampleBooking, id: 'b2' }],
      total: 2,
      totalPages: 1,
      page: 1,
      pageSize: 20,
    });
    mockCancelBookingApi.mockResolvedValue(undefined);
    const { result } = renderHook(() => useBookings('u1'));

    await waitFor(() => expect(result.current.data)?.toHaveLength(2));

    await act(() => result.current.cancelBooking('b1'));

    expect(mockCancelBookingApi).toHaveBeenCalledWith('b1');
    expect(result.current.data).toEqual([{ ...sampleBooking, id: 'b2' }]);
  });

  it('rescheduleBooking updates item in data', async () => {
    mockFetchMyBookingsApi.mockResolvedValue({
      items: [{ ...sampleBooking, date: '2026-06-01' }],
      total: 1,
      totalPages: 1,
      page: 1,
      pageSize: 20,
    });
    mockRescheduleBookingApi.mockResolvedValue({ ...sampleBooking, date: '2026-07-01' });
    const { result } = renderHook(() => useBookings('u1'));

    await waitFor(() => expect(result.current.data)?.toHaveLength(1));

    await act(() => result.current.rescheduleBooking('b1', '2026-07-01'));

    expect(mockRescheduleBookingApi).toHaveBeenCalledWith('b1', '2026-07-01');
    expect(result.current.data?.[0]?.date).toBe('2026-07-01');
  });

  it('setPage triggers refetch', async () => {
    mockFetchMyBookingsApi.mockResolvedValue({
      items: [],
      total: 0,
      totalPages: 0,
      page: 1,
      pageSize: 20,
    });
    const { result } = renderHook(() => useBookings('u1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockFetchMyBookingsApi).toHaveBeenCalledWith('u1', 1, 20);

    await act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => expect(mockFetchMyBookingsApi).toHaveBeenCalledWith('u1', 2, 20));
  });
});
