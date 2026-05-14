import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth';
import { fetchMyBookingsApi, cancelBookingApi, rescheduleBookingApi } from '@/api/customer';
import { classTypes, weeklySchedule, locations } from '@/mocks/fixtures';
import type { Booking } from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function statusBadgeColor(status: string) {
  switch (status) {
    case 'confirmed':
      return 'green';
    case 'attended':
      return 'primary';
    case 'cancelled':
      return 'accent';
    case 'no-show':
      return 'warm';
    default:
      return 'gray';
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function isUpcoming(b: Booking) {
  return b.status === 'confirmed' && b.date >= todayStr();
}

export default function BookingsPage() {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const bks = await fetchMyBookingsApi(user.id);
        setBookings(bks);
      } catch {
        // API errors are non-fatal; component renders empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const upcoming = bookings.filter(isUpcoming);
  const history = bookings.filter((b) => !isUpcoming(b));

  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const updated = await cancelBookingApi(cancelTarget.id);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  }

  async function handleReschedule() {
    if (!rescheduleTarget || !newDate) return;
    setRescheduling(true);
    try {
      const updated = await rescheduleBookingApi(rescheduleTarget.id, newDate);
      setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setRescheduleTarget(null);
      setNewDate('');
    } finally {
      setRescheduling(false);
    }
  }

  function openReschedule(b: Booking) {
    setNewDate(b.date);
    setRescheduleTarget(b);
  }

  function resolveBookingInfo(b: Booking) {
    const ct = classTypes.find((c) => c.id === b.classTypeId);
    const slot = weeklySchedule.find((s) => s.id === b.scheduleId);
    const loc = slot ? locations.find((l) => l.id === slot.locationId) : null;
    return { ct, slot, loc };
  }

  function renderBookingRow(b: Booking) {
    const { ct, slot, loc } = resolveBookingInfo(b);
    const past = b.date < todayStr();
    return (
      <div
        key={b.id}
        className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{ct?.name ?? t('common.classes')}</p>
          <p className="text-xs text-gray-500">
            {formatDate(b.date)}
            {slot ? ` · ${slot.startTime}—${slot.endTime}` : ''}
            {loc ? (
              <span className="inline-flex items-center gap-1">
                <span> · </span>
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: loc.color }} />
                {loc.name}
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={statusBadgeColor(b.status)}>{b.status}</Badge>
          {b.status === 'confirmed' && !past && (
            <>
              <Button size="sm" variant="outline" onClick={() => openReschedule(b)}>
                {t('customerBookings.reschedule')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCancelTarget(b)}>
                {t('customerBookings.cancel')}
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (loading) return <Spinner centered size="lg" />;

  const tabs = [
    {
      id: 'upcoming',
      label: t('customerBookings.upcoming', { count: upcoming.length }),
      content:
        upcoming.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            <p>{t('customerBookings.noUpcoming')}</p>
          </div>
        ) : (
          <div className="space-y-3">{upcoming.map(renderBookingRow)}</div>
        ),
    },
    {
      id: 'history',
      label: t('customerBookings.history', { count: history.length }),
      content:
        history.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            <p>{t('customerBookings.noHistory')}</p>
          </div>
        ) : (
          <div className="space-y-3">{history.map(renderBookingRow)}</div>
        ),
    },
  ];

  return (
    <>
      <SEO
        title={t('seo.customerBookingsTitle')}
        description={t('seo.customerBookingsDescription')}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('customerBookings.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('customerBookings.subtitle')}</p>
      </div>

      <Card>
        <Tabs tabs={tabs} activeId={tab} onChange={setTab} />
      </Card>

      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title={t('customerBookings.cancelTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600">{t('customerBookings.cancelBody')}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setCancelTarget(null)}>
            {t('common.keep')}
          </Button>
          <Button variant="accent" loading={cancelling} onClick={handleCancel}>
            {t('common.yesCancel')}
          </Button>
        </div>
      </Modal>

      <Modal
        open={!!rescheduleTarget}
        onClose={() => {
          setRescheduleTarget(null);
          setNewDate('');
        }}
        title={t('customerBookings.rescheduleTitle')}
        size="sm"
      >
        <label htmlFor="new-date" className="block text-sm font-medium text-gray-700">
          {t('customerBookings.newDate')}
        </label>
        <input
          id="new-date"
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setRescheduleTarget(null);
              setNewDate('');
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button loading={rescheduling} onClick={handleReschedule} disabled={!newDate}>
            {t('common.confirm')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
