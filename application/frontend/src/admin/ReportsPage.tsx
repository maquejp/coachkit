import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import {
  fetchCustomerReport,
  fetchAttendanceReportAdmin,
  fetchSubscriptionReport,
  fetchOccupancyReport,
  fetchRevenueReport,
  exportReportCsv,
  exportReportPdf,
} from '@/api/admin';
import type {
  CustomerReportRow,
  AttendanceReportRow,
  SubscriptionReport,
  OccupancyReportRow,
  RevenueReportRow,
} from '@/api/admin';

type Tab = 'customers' | 'attendance' | 'subscriptions' | 'occupancy' | 'revenue';

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default function ReportsPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('customers');

  const TABS: { key: Tab; label: string }[] = [
    { key: 'customers', label: t('adminReports.tabs.customers') },
    { key: 'attendance', label: t('adminReports.tabs.attendance') },
    { key: 'subscriptions', label: t('adminReports.tabs.subscriptions') },
    { key: 'occupancy', label: t('adminReports.tabs.occupancy') },
    { key: 'revenue', label: t('adminReports.tabs.revenue') },
  ];

  return (
    <>
      <SEO title={t('seo.adminReportsTitle')} description={t('seo.adminReportsDescription')} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('adminReports.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('adminReports.subtitle')}</p>
      </div>

      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {TABS.map((tItem) => (
          <button
            key={tItem.key}
            onClick={() => setTab(tItem.key)}
            className={
              'px-4 py-2 text-sm font-medium transition-colors ' +
              (tab === tItem.key
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-gray-500 hover:text-gray-700')
            }
          >
            {tItem.label}
          </button>
        ))}
      </div>

      {tab === 'customers' && <CustomerReportTab />}
      {tab === 'attendance' && <AttendanceReportTab />}
      {tab === 'subscriptions' && <SubscriptionReportTab />}
      {tab === 'occupancy' && <OccupancyReportTab />}
      {tab === 'revenue' && <RevenueReportTab />}
    </>
  );
}

function CustomerReportTab() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<CustomerReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchCustomerReport({});
        if (!cancelled) setRows(data);
      } catch {
        // non-fatal
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleExportCsv() {
    setExporting(true);
    try {
      await exportReportCsv('customers');
    } catch {
      // non-fatal
    } finally {
      setExporting(false);
    }
  }

  async function handleExportPdf() {
    setExporting(true);
    try {
      await exportReportPdf('customers');
    } catch {
      // non-fatal
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <Spinner centered size="lg" />;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button size="sm" variant="outline" onClick={handleExportCsv} loading={exporting}>
          {t('adminReports.exportCsv')}
        </Button>
        <Button size="sm" variant="outline" onClick={handleExportPdf} loading={exporting}>
          {t('adminReports.exportPdf')}
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminReports.noCustomerData')}
          </div>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  {t('adminReports.name')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  {t('adminReports.email')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  {t('adminReports.status')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  {t('adminReports.plan')}
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  {t('adminReports.sessions')}
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  {t('adminReports.bookings')}
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  {t('adminReports.lastBooking')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.email}</td>
                  <td className="px-4 py-3">
                    <Badge color={r.status === 'active' ? 'green' : 'gray'}>{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.subscriptionPlan ?? '\u2014'}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {r.sessionsLimit ? r.sessionsUsed + ' / ' + r.sessionsLimit : r.sessionsUsed}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{r.totalBookings}</td>
                  <td className="px-4 py-3 text-gray-600">{r.lastBookingDate ?? '\u2014'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AttendanceReportTab() {
  const { t } = useTranslation();
  const today = todayString();
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(today);
  const [rows, setRows] = useState<AttendanceReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchAttendanceReportAdmin({ from, to });
        if (!cancelled) setRows(data);
      } catch {
        // non-fatal
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  async function handleExportCsv() {
    setExporting(true);
    try {
      await exportReportCsv('attendance', { from, to });
    } catch {
      // non-fatal
    } finally {
      setExporting(false);
    }
  }

  async function handleExportPdf() {
    setExporting(true);
    try {
      await exportReportPdf('attendance', { from, to });
    } catch {
      // non-fatal
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="max-w-40"
        />
        <span className="self-center text-sm text-gray-500">{t('adminReports.to')}</span>
        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="max-w-40"
        />
        <Button size="sm" variant="outline" onClick={handleExportCsv} loading={exporting}>
          {t('adminReports.exportCsv')}
        </Button>
        <Button size="sm" variant="outline" onClick={handleExportPdf} loading={exporting}>
          {t('adminReports.exportPdf')}
        </Button>
      </div>

      {loading ? (
        <Spinner centered size="lg" />
      ) : rows.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminReports.noAttendance')}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <Card key={r.date}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{r.date}</h3>
                <div className="flex gap-3 text-sm text-gray-500">
                  <span>{t('adminReports.checkIns', { count: r.totalCheckIns })}</span>
                  <span>{t('adminReports.uniqueCustomers', { count: r.uniqueCustomers })}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {r.byClass.map((c) => (
                  <Badge key={c.className} color="blue">
                    {c.className}: {c.count}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SubscriptionReportTab() {
  const { t } = useTranslation();
  const [report, setReport] = useState<SubscriptionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchSubscriptionReport();
        if (!cancelled) setReport(data);
      } catch {
        // non-fatal
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleExportCsv() {
    setExporting(true);
    try {
      await exportReportCsv('subscriptions');
    } catch {
      // non-fatal
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <Spinner centered size="lg" />;
  if (!report) return null;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button size="sm" variant="outline" onClick={handleExportCsv} loading={exporting}>
          {t('adminReports.exportCsv')}
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{report.totalActive}</p>
            <p className="text-xs text-gray-500">{t('adminReports.active')}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{report.totalCancelled}</p>
            <p className="text-xs text-gray-500">{t('adminReports.cancelled')}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{report.totalExpired}</p>
            <p className="text-xs text-gray-500">{t('adminReports.expired')}</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {(report.churnRate * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">{t('adminReports.churnRate')}</p>
          </div>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="p-4">
            <p className="text-xs text-gray-500">{t('adminReports.monthlyRevenue')}</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(report.monthlyRevenueCents)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-xs text-gray-500">{t('adminReports.annualRevenue')}</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(report.annualRevenueCents)}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">{t('adminReports.byPlan')}</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  {t('adminReports.planHeader')}
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  {t('adminReports.activeHeader')}
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  {t('adminReports.cancelledHeader')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {report.byPlan.map((p) => (
                <tr key={p.planName} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.planName}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{p.active}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{p.cancelled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function OccupancyReportTab() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<OccupancyReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchOccupancyReport({});
        if (!cancelled) setRows(data);
      } catch {
        // non-fatal
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleExportCsv() {
    setExporting(true);
    try {
      await exportReportCsv('occupancy');
    } catch {
      // non-fatal
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <Spinner centered size="lg" />;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button size="sm" variant="outline" onClick={handleExportCsv} loading={exporting}>
          {t('adminReports.exportCsv')}
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportReportPdf('occupancy')}>
          {t('adminReports.exportPdf')}
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminReports.noOccupancy')}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <Card key={r.className}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{r.className}</h3>
                  <p className="text-xs text-gray-500">
                    {t('adminReports.slotsFilled', {
                      bookings: r.totalBookings,
                      slots: r.totalSlots,
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: String(r.averageOccupancy * 100) + '%' }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(r.averageOccupancy * 100)}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {t('adminReports.peak', { day: r.peakDay, time: r.peakTime })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function RevenueReportTab() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<RevenueReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchRevenueReport();
        if (!cancelled) setRows(data);
      } catch {
        // non-fatal
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleExportCsv() {
    setExporting(true);
    try {
      await exportReportCsv('revenue');
    } catch {
      // non-fatal
    } finally {
      setExporting(false);
    }
  }

  const totalRevenue = rows.reduce((s, r) => s + r.revenueCents, 0);

  if (loading) return <Spinner centered size="lg" />;

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Button size="sm" variant="outline" onClick={handleExportCsv} loading={exporting}>
          {t('adminReports.exportCsv')}
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportReportPdf('revenue')}>
          {t('adminReports.exportPdf')}
        </Button>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <p className="text-xs text-gray-500">{t('adminReports.totalRevenue')}</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
        </div>
      </Card>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                {t('adminReports.month')}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                {t('adminReports.total')}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                {t('adminReports.subscriptions')}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                {t('adminReports.pointCards')}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                {t('adminReports.bookingsRev')}
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">
                {t('adminReports.transactions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.month} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{r.month}</td>
                <td className="px-4 py-3 text-right font-medium text-gray-900">
                  {formatCurrency(r.revenueCents)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {formatCurrency(r.subscriptionCents)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {formatCurrency(r.pointCardCents)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {formatCurrency(r.bookingsCents)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">{r.transactions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
