import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useCustomers } from '@/hooks/useCustomers';

const mockFetchAdminCustomers = vi.fn();

vi.mock('@/api/admin', () => ({
  fetchAdminCustomers: (...args: unknown[]) => mockFetchAdminCustomers(...args),
}));

const sampleCustomer = {
  id: 'u1',
  email: 'alice@example.test',
  role: 'customer' as const,
  firstName: 'Alice',
  lastName: 'Johnson',
  phone: '+1-555-0102',
  avatarUrl: null,
  emailVerifiedAt: '2025-01-15T00:00:00Z',
  createdAt: '2025-01-10T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
};

const samplePage = { items: [sampleCustomer], total: 1, totalPages: 1, page: 1, pageSize: 10 };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useCustomers', () => {
  it('starts in loading state with null data', () => {
    mockFetchAdminCustomers.mockResolvedValue(samplePage);
    const { result } = renderHook(() => useCustomers());

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('fetches customers on mount', async () => {
    mockFetchAdminCustomers.mockResolvedValue(samplePage);
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(samplePage);
    expect(result.current.error).toBeNull();
    expect(mockFetchAdminCustomers).toHaveBeenCalledWith({
      search: '',
      page: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortDir: 'desc',
    });
  });

  it('sets error when API fails', async () => {
    mockFetchAdminCustomers.mockRejectedValue(new Error('Failed to load'));
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Failed to load');
  });

  it('sets generic error for non-Error rejections', async () => {
    mockFetchAdminCustomers.mockRejectedValue('string error');
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to load customers');
  });

  it('refetch refetches data', async () => {
    mockFetchAdminCustomers.mockResolvedValue(samplePage);
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockFetchAdminCustomers).toHaveBeenCalledTimes(1);

    mockFetchAdminCustomers.mockResolvedValue({ ...samplePage, total: 0, items: [] });
    await act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.data?.total).toBe(0));
    expect(mockFetchAdminCustomers).toHaveBeenCalledTimes(2);
  });

  it('setSearch triggers refetch with new search term', async () => {
    mockFetchAdminCustomers.mockResolvedValue(samplePage);
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    mockFetchAdminCustomers.mockResolvedValue({ ...samplePage, total: 0, items: [] });
    await act(() => {
      result.current.setSearch('Alice');
    });

    await waitFor(() => {
      expect(mockFetchAdminCustomers).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: 'Alice' }),
      );
    });
  });

  it('setPage triggers refetch with new page number', async () => {
    mockFetchAdminCustomers.mockResolvedValue(samplePage);
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(() => {
      result.current.setPage(3);
    });

    await waitFor(() => {
      expect(mockFetchAdminCustomers).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 3 }),
      );
    });
  });

  it('setSortBy and setSortDir trigger refetch', async () => {
    mockFetchAdminCustomers.mockResolvedValue(samplePage);
    const { result } = renderHook(() => useCustomers());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(() => {
      result.current.setSortBy('email');
      result.current.setSortDir('asc');
    });

    await waitFor(() => {
      expect(mockFetchAdminCustomers).toHaveBeenLastCalledWith(
        expect.objectContaining({ sortBy: 'email', sortDir: 'asc' }),
      );
    });
  });
});
