import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { useAttendance } from '@/hooks/useAttendance';
import { fetchSessionUsage, type SessionUsageEntry } from '@/api/admin';

type Tab = 'checkin' | 'history' | 'usage';

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
  const { selectedDate, setSelectedDate, checkInBookings, checkInLoading, checkIn, checkingIn } =
    useAttendance();

  const grouped = (checkInBookings ?? []).reduce(
    (acc, b) => {
      const key = b.className;
      if (!acc[key]) acc[key] = [];
      acc[key].push(b);
      return acc;
    },
    {} as Record<string, typeof checkInBookings extends (infer U)[] ? U[] : never>,
  );

  return (
    <div>
      <div className="mb-4">
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="max-w-xs"
        />
      </div>
      {checkInLoading ? (
        <Skeleton variant="card" />
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
                      <Button size="sm" onClick={() => checkIn(b.id)} loading={checkingIn}>
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
  const { fetchReport, reportData, reportLoading, reportPage } = useAttendance();
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);

  useEffect(() => {
    fetchReport(from, to, 1);
    // Only runs on mount — manual search triggers reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch() {
    fetchReport(from, to, 1);
  }

  function handlePageChange(p: number) {
    fetchReport(from, to, p);
  }

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
        <Button size="sm" onClick={handleSearch} loading={reportLoading}>
          {t('common.search')}
        </Button>
      </div>
      {reportLoading ? (
        <Skeleton variant="card" />
      ) : !reportData || reportData.items.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminAttendance.noRecords')}
          </div>
        </Card>
      ) : (
        <>
          <p className="mb-3 text-sm text-gray-500">
            {t('adminAttendance.recordsFound', { count: reportData.total })}
          </p>
          <div className="space-y-2">
            {reportData.items.map((r) => (
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
          <div className="mt-4 flex justify-center">
            <Pagination
              current={reportPage}
              total={reportData.totalPages}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

function UsageTab() {
  const { t } = useTranslation();
  const [usageData, setUsageData] = useState<SessionUsageEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchSessionUsage();
        setUsageData(data);
      } catch {
        setUsageData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {loading ? (
        <Skeleton variant="card" />
      ) : !usageData || usageData.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminAttendance.noUsageData')}
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {usageData.map((entry) => (
            <Card key={entry.userId}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{entry.customerName}</p>
                  {entry.subscription && (
                    <p className="text-sm text-gray-500">
                      {entry.subscription.planName}
                      {entry.subscription.sessionsLimit
                        ? ` (${entry.subscription.sessionsUsed}/${entry.subscription.sessionsLimit})`
                        : ` (${entry.subscription.sessionsUsed})`}
                    </p>
                  )}
                </div>
                <Badge color={entry.subscription?.status === 'active' ? 'green' : 'warm'}>
                  {entry.subscription?.status ?? t('common.inactive')}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
