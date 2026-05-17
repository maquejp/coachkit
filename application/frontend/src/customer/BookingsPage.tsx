import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { useAuthStore } from '@/stores/auth';
import { useBookings } from '@/hooks/useBookings';
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
  const {
    data: bookings,
    totalPages,
    page,
    setPage,
    cancelBooking: cancel,
    rescheduleBooking: reschedule,
  } = useBookings(user?.id);
  const [tab, setTab] = useState('upcoming');
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  const loading = !bookings;
  const bks = bookings ?? [];
  const upcoming = bks.filter(isUpcoming);
  const history = bks.filter((b) => !isUpcoming(b));

  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await cancel(cancelTarget.id);
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  }

  async function handleReschedule() {
    if (!rescheduleTarget || !newDate) return;
    setRescheduling(true);
    try {
      await reschedule(rescheduleTarget.id, newDate);
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

  function renderBookingRow(b: Booking) {
    const past = b.date < todayStr();
    return (
      <div
        key={b.id}
        className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{b.className ?? b.classTypeId}</p>
          <p className="text-xs text-gray-500">{formatDate(b.date)}</p>
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

  if (loading) return <Skeleton variant="card" />;

  const tabs = [
    {
      id: 'upcoming',
      label: t('customerBookings.upcoming', { count: upcoming.length }),
      content:
        upcoming.length === 0 ? (
          <EmptyState message={t('customerBookings.noUpcoming')} />
        ) : (
          <div className="space-y-3">{upcoming.map(renderBookingRow)}</div>
        ),
    },
    {
      id: 'history',
      label: t('customerBookings.history', { count: history.length }),
      content:
        history.length === 0 ? (
          <EmptyState message={t('customerBookings.noHistory')} />
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
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      )}

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
