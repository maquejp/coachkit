import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import {
  fetchCheckInBookings,
  checkInBooking,
  fetchAttendanceReport,
  fetchSessionUsage,
} from '@/api/admin';
import type { CheckInBooking, AttendanceReportRecord, SessionUsageEntry } from '@/api/admin';

type Tab = 'checkin' | 'history' | 'usage';

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function AttendancePage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>('checkin');

  const TABS: { key: Tab; label: string }[] = [
    { key: 'checkin', label: t('adminAttendance.tabs.checkIn') },
    { key: 'history', label: t('adminAttendance.tabs.history') },
    { key: 'usage', label: t('adminAttendance.tabs.usageReport') },
  ];

  return (
    <>
      <SEO
        title={t('seo.adminAttendanceTitle')}
        description={t('seo.adminAttendanceDescription')}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('adminAttendance.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('adminAttendance.subtitle')}</p>
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

      {tab === 'checkin' && <CheckInTab />}
      {tab === 'history' && <HistoryTab />}
      {tab === 'usage' && <UsageTab />}
    </>
  );
}

function CheckInTab() {
  const { t } = useTranslation();
  const [date, setDate] = useState(todayString);
  const [bookings, setBookings] = useState<CheckInBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchCheckInBookings(date);
        if (!cancelled) setBookings(data);
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
  }, [date]);

  async function handleCheckIn(bookingId: string) {
    setCheckingIn(bookingId);
    try {
      await checkInBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: 'attended' as const, checkInTime: new Date().toLocaleTimeString() }
            : b,
        ),
      );
    } catch {
      // non-fatal
    } finally {
      setCheckingIn(null);
    }
  }

  const grouped = bookings.reduce(
    (acc, b) => {
      const key = b.className;
      if (!acc[key]) acc[key] = [];
      acc[key].push(b);
      return acc;
    },
    {} as Record<string, CheckInBooking[]>,
  );

  return (
    <div>
      <div className="mb-4">
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {loading ? (
        <Spinner centered size="lg" />
      ) : Object.keys(grouped).length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminAttendance.noBookings')}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([className, items]) => (
            <Card key={className}>
              <div className="mb-3 flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: items[0]?.classColor ?? '#ccc' }}
                />
                <h2 className="text-sm font-semibold text-gray-900">{className}</h2>
                <Badge color="blue">{items.length}</Badge>
              </div>
              <div className="space-y-2">
                {items.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{b.customerName}</p>
                      {b.guestEmail && (
                        <p className="text-xs text-gray-500">
                          {t('adminAttendance.guest', { email: b.guestEmail })}
                        </p>
                      )}
                    </div>
                    {b.checkInTime ? (
                      <Badge color="green">
                        {t('adminAttendance.checkedIn', { time: b.checkInTime })}
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(b.id)}
                        loading={checkingIn === b.id}
                      >
                        {t('adminAttendance.checkIn')}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryTab() {
  const { t } = useTranslation();
  const today = todayString();
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [result, setResult] = useState<{ total: number; records: AttendanceReportRecord[] } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchAttendanceReport(from, to);
        if (!cancelled) setResult(data);
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

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="max-w-40"
        />
        <span className="self-center text-sm text-gray-500">{t('adminAttendance.to')}</span>
        <Input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="max-w-40"
        />
      </div>

      {loading ? (
        <Spinner centered size="lg" />
      ) : !result || result.records.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminAttendance.noRecords')}
          </div>
        </Card>
      ) : (
        <>
          <p className="mb-3 text-sm text-gray-500">
            {t('adminAttendance.recordsFound', { count: result.total })}
          </p>
          <div className="space-y-2">
            {result.records.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: r.classColor }} />
                  <div>
                    <p className="font-medium text-gray-900">{r.customerName}</p>
                    <p className="text-xs text-gray-500">{r.className}</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{r.date}</p>
                  <p className="text-xs">{r.checkInTime}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function UsageTab() {
  const { t } = useTranslation();
  const [usage, setUsage] = useState<SessionUsageEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchSessionUsage();
        if (!cancelled) setUsage(data);
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

  if (loading) return <Spinner centered size="lg" />;

  const withUsage = usage.filter((u) => u.subscription || u.pointCards.length > 0);

  if (withUsage.length === 0) {
    return (
      <Card>
        <div className="py-12 text-center text-sm text-gray-400">
          {t('adminAttendance.noUsageData')}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {withUsage.map((u) => (
        <Card key={u.userId}>
          <h3 className="mb-3 font-medium text-gray-900">{u.customerName}</h3>
          <div className="space-y-2">
            {u.subscription && (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{u.subscription.planName}</p>
                  <p className="text-xs text-gray-500">
                    {u.subscription.sessionsUsed}
                    {u.subscription.sessionsLimit ? ' / ' + u.subscription.sessionsLimit : ''}{' '}
                    sessions
                  </p>
                </div>
                <Badge
                  color={
                    u.subscription.status === 'active'
                      ? 'green'
                      : u.subscription.status === 'cancelled'
                        ? 'accent'
                        : 'gray'
                  }
                >
                  {u.subscription.status}
                </Badge>
              </div>
            )}
            {u.pointCards.map((pc, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{pc.planName}</p>
                  <p className="text-xs text-gray-500">
                    {pc.sessionsRemaining} / {pc.totalSessions} remaining {'\u00B7'} Expires{' '}
                    {new Date(pc.expiresAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge color="warm">
                  {Math.round((pc.sessionsRemaining / pc.totalSessions) * 100)}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
