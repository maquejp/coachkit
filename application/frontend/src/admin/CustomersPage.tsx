import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { fetchAdminCustomers } from '@/api/admin';
import type { CustomerUser, PaginatedResult } from '@/api/admin';

const PAGE_SIZES = [5, 10, 20, 50];

function SortIcon({ sortBy, sortDir, field }: { sortBy: string; sortDir: string; field: string }) {
  if (sortBy !== field) return <span className="ml-1 text-gray-300">&#8597;</span>;
  return <span className="ml-1 text-primary-600">{sortDir === 'asc' ? '&#8593;' : '&#8595;'}</span>;
}

export default function CustomersPage() {
  const [result, setResult] = useState<PaginatedResult<CustomerUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchAdminCustomers({ search, page, pageSize, sortBy, sortDir });
        if (!cancelled) setResult(res);
      } catch {
        // non-fatal
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search, page, pageSize, sortBy, sortDir]);

  function handleSort(field: string) {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  }

  return (
    <>
      <SEO title="Customer Management" description="Manage customers." />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="mt-1 text-gray-500">
            {result ? `${result.total} total customers` : 'Manage customers.'}
          </p>
        </div>
      </div>

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-xs"
          />
          <Select
            value={String(pageSize)}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="w-24"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {loading ? (
        <Spinner centered size="lg" />
      ) : !result || result.items.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">No customers found.</div>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-gray-500"
                    onClick={() => handleSort('firstName')}
                  >
                    Name
                    <SortIcon sortBy={sortBy} sortDir={sortDir} field="firstName" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-gray-500"
                    onClick={() => handleSort('email')}
                  >
                    Email
                    <SortIcon sortBy={sortBy} sortDir={sortDir} field="email" />
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500">Phone</th>
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-gray-500"
                    onClick={() => handleSort('createdAt')}
                  >
                    Member Since
                    <SortIcon sortBy={sortBy} sortDir={sortDir} field="createdAt" />
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500">Verified</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {result.items.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/customers/${u.id}`}
                        className="font-medium text-gray-900 hover:text-primary-600"
                      >
                        {u.firstName} {u.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={u.emailVerifiedAt ? 'green' : 'gray'}>
                        {u.emailVerifiedAt ? 'Verified' : 'Unverified'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/customers/${u.id}`}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {result.page} of {result.totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page >= result.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
