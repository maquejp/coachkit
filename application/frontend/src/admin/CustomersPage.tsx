import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  if (sortBy !== field) return <span className="ml-1 text-gray-300">{'\u2195'}</span>;
  return <span className="ml-1 text-primary-600">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>;
}

export default function CustomersPage() {
  const { t } = useTranslation();
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
      <SEO title={t('seo.adminCustomersTitle')} description={t('seo.adminCustomersDescription')} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('adminCustomers.heading')}</h1>
          <p className="mt-1 text-gray-500">
            {result
              ? t('adminCustomers.totalCustomers', { count: result.total })
              : t('seo.adminCustomersDescription')}
          </p>
        </div>
      </div>

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder={t('common.searchPlaceholder')}
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
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminCustomers.noCustomers')}
          </div>
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
                    {t('adminCustomers.name')}
                    <SortIcon sortBy={sortBy} sortDir={sortDir} field="firstName" />
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-gray-500"
                    onClick={() => handleSort('email')}
                  >
                    {t('adminCustomers.email')}
                    <SortIcon sortBy={sortBy} sortDir={sortDir} field="email" />
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500">
                    {t('adminCustomers.phone')}
                  </th>
                  <th
                    className="cursor-pointer px-4 py-3 font-medium text-gray-500"
                    onClick={() => handleSort('createdAt')}
                  >
                    {t('adminCustomers.memberSince')}
                    <SortIcon sortBy={sortBy} sortDir={sortDir} field="createdAt" />
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-500">
                    {t('adminCustomers.verified')}
                  </th>
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
                        to={'/admin/customers/' + u.id}
                        className="font-medium text-gray-900 hover:text-primary-600"
                      >
                        {u.firstName} {u.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-gray-600">{u.phone ?? '\u2014'}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={u.emailVerifiedAt ? 'green' : 'gray'}>
                        {u.emailVerifiedAt ? t('common.verified') : t('common.unverified')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={'/admin/customers/' + u.id}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        {t('adminCustomers.view')}
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
                {t('adminCustomers.pagination', {
                  page: result.page,
                  totalPages: result.totalPages,
                })}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('common.previous')}
                </button>
                <button
                  disabled={page >= result.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('common.next')}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
