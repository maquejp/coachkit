import { useEffect, useState, useCallback } from 'react';
import type { CustomerUser, PaginatedResult } from '@/api/admin';
import { fetchAdminCustomers } from '@/api/admin';

interface UseCustomersResult {
  data: PaginatedResult<CustomerUser> | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  search: string;
  setSearch: (s: string) => void;
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  sortDir: 'asc' | 'desc';
  setSortDir: (d: 'asc' | 'desc') => void;
}

export function useCustomers(): UseCustomersResult {
  const [data, setData] = useState<PaginatedResult<CustomerUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAdminCustomers({ search, page, pageSize, sortBy, sortDir });
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize, sortBy, sortDir]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetch();
  }, [fetch]);

  return {
    data,
    loading,
    error,
    refetch: fetch,
    search,
    setSearch,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    setSortBy,
    sortDir,
    setSortDir,
  };
}
