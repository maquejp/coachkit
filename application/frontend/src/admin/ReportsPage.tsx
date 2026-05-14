import { useEffect, useState } from 'react';
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

const TABS: { key: Tab; label: string }[] = [
  { key: 'customers', label: 'Customers' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'subscriptions', label: 'Subscriptions' },
  { key: 'occupancy', label: 'Occupancy' },
  { key: 'revenue', label: 'Revenue' },
];

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
  const [tab, setTab] = useState<Tab>('customers');

  return (
    <>
      <SEO title="Reports" description="Admin reports and data export." />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-gray-500">
          View and export reports across customers, attendance, subscriptions, occupancy, and
          revenue.
        </p>
      </div>

      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
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
          Export CSV
        </Button>
        <Button size="sm" variant="outline" onClick={handleExportPdf} loading={exporting}>
          Export PDF
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">No customer data found.</div>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Plan</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Sessions</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Bookings</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Last Booking</th>
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
                  <td className="px-4 py-3 text-gray-600">{r.subscriptionPlan ?? '—'}</td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {r.sessionsLimit ? `${r.sessionsUsed} / ${r.sessionsLimit}` : r.sessionsUsed}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{r.totalBookings}</td>
                  <td className="px-4 py-3 text-gray-600">{r.lastBookingDate ?? '—'}</td>
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
        <span className="self-center text-sm text-gray-500">to</span>
        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="max-w-40"
        />
        <Button size="sm" variant="outline" onClick={handleExportCsv} loading={exporting}>
          Export CSV
        </Button>
        <Button size="sm" variant="outline" onClick={handleExportPdf} loading={exporting}>
          Export PDF
        </Button>
      </div>

      {loading ? (
        <Spinner centered size="lg" />
      ) : rows.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            No attendance records found.
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <Card key={r.date}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{r.date}</h3>
                <div className="flex gap-3 text-sm text-gray-500">
                  <span>{r.totalCheckIns} check-ins</span>
                  <span>{r.uniqueCustomers} unique</span>
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
          Export CSV
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{report.totalActive}</p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{report.totalCancelled}</p>
            <p className="text-xs text-gray-500">Cancelled</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{report.totalExpired}</p>
            <p className="text-xs text-gray-500">Expired</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">
              {(report.churnRate * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">Churn Rate</p>
          </div>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <div className="p-4">
            <p className="text-xs text-gray-500">Monthly Revenue</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(report.monthlyRevenueCents)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <p className="text-xs text-gray-500">Annual Revenue</p>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(report.annualRevenueCents)}
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">By Plan</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Plan</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Active</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Cancelled</th>
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
          Export CSV
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportReportPdf('occupancy')}>
          Export PDF
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">No occupancy data found.</div>
        </Card>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <Card key={r.className}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{r.className}</h3>
                  <p className="text-xs text-gray-500">
                    {r.totalBookings} / {r.totalSlots} slots filled
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${r.averageOccupancy * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(r.averageOccupancy * 100)}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Peak: {r.peakDay} at {r.peakTime}
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
          Export CSV
        </Button>
        <Button size="sm" variant="outline" onClick={() => exportReportPdf('revenue')}>
          Export PDF
        </Button>
      </div>

      <Card className="mb-6">
        <div className="p-4">
          <p className="text-xs text-gray-500">Total Revenue (period)</p>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
        </div>
      </Card>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Month</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Total</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Subscriptions</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Point Cards</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Bookings</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Transactions</th>
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
