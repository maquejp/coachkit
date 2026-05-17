import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { useLocations } from '@/hooks/useLocations';
import { useWeeklySchedule } from '@/hooks/useWeeklySchedule';
import { useScheduleExceptions } from '@/hooks/useScheduleExceptions';
import { useClassTypes } from '@/hooks/useClassTypes';

function formatTime(time: string) {
  const [h, m] = time.split(':');
  const hour = Number(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return h12 + ':' + m + ' ' + ampm;
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: locations, loading: locLoading } = useLocations();
  const { data: schedules, loading: schedLoading } = useWeeklySchedule();
  const { data: exceptions, loading: excLoading } = useScheduleExceptions();
  const { data: classTypes, loading: ctLoading } = useClassTypes();

  const location = useMemo(
    () => (locations ?? []).find((l) => l.id === id) ?? null,
    [locations, id],
  );
  const locSchedules = useMemo(
    () => (schedules ?? []).filter((s) => s.locationId === id),
    [schedules, id],
  );
  const locExceptions = useMemo(
    () => (exceptions ?? []).filter((e) => e.locationId === id),
    [exceptions, id],
  );

  const loading = locLoading || schedLoading || excLoading || ctLoading;

  if (loading) return <Spinner centered size="lg" />;
  if (!location) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">{t('adminLocationDetail.locationNotFound')}</p>
        <Link
          to="/admin/locations"
          className="mt-2 inline-block text-sm text-primary-600 hover:underline"
        >
          {t('adminLocationDetail.backToLocations')}
        </Link>
      </div>
    );
  }

  const groupedSchedules = DAY_NAMES.map((name, idx) => ({
    day: name,
    dayNum: idx + 1,
    slots: locSchedules.filter((s) => s.dayOfWeek === idx + 1),
  }));
  const hasSchedule = locSchedules.length > 0;

  return (
    <>
      <SEO title={location.name} description={t('seo.adminLocationsDescription')} />
      <div className="mb-6">
        <Link to="/admin/locations" className="text-sm text-primary-600 hover:underline">
          {t('adminLocationDetail.backToLocations')}
        </Link>
      </div>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: location.color }} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{location.name}</h1>
            <p className="text-gray-500">
              {location.address}, {location.city}
            </p>
          </div>
        </div>
        <Badge color={location.isActive ? 'green' : 'gray'}>
          {location.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      </div>
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            {t('adminLocationDetail.contactInfo')}
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-700">{t('adminLocationDetail.phone')}</span>{' '}
              {location.phone ?? '\u2014'}
            </p>
            <p>
              <span className="font-medium text-gray-700">{t('adminLocationDetail.email')}</span>{' '}
              {location.email ?? '\u2014'}
            </p>
            {location.mapLink && (
              <p>
                <span className="font-medium text-gray-700">
                  {t('adminLocationDetail.mapLink')}
                </span>{' '}
                <a
                  href={location.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  {t('adminLocationDetail.viewMap')}
                </a>
              </p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            {t('adminLocationDetail.stats')}
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-700">
                {t('adminLocationDetail.weeklySlots')}
              </span>{' '}
              {locSchedules.length}
            </p>
            <p>
              <span className="font-medium text-gray-700">
                {t('adminLocationDetail.exceptions')}
              </span>{' '}
              {locExceptions.length}
            </p>
          </div>
        </Card>
      </div>
      <Card className="mb-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t('adminLocationDetail.schedule')}
        </h2>
        {!hasSchedule ? (
          <div className="py-8 text-center text-sm text-gray-400">
            {t('adminLocationDetail.noSchedule')}
          </div>
        ) : (
          <div className="space-y-4">
            {groupedSchedules.map(
              (g) =>
                g.slots.length > 0 && (
                  <div key={g.day}>
                    <h3 className="mb-1 text-sm font-medium text-gray-700">{g.day}</h3>
                    <div className="space-y-1">
                      {g.slots.map((slot) => {
                        const ct = (classTypes ?? []).find((c) => c.id === slot.classTypeId);
                        return (
                          <div
                            key={slot.id}
                            className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm"
                          >
                            <span className="font-medium text-gray-900">
                              {ct?.name ?? t('common.classes')}
                            </span>
                            <span className="text-gray-500">
                              {formatTime(slot.startTime)}-{formatTime(slot.endTime)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ),
            )}
          </div>
        )}
      </Card>
      {locExceptions.length > 0 && (
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            {t('adminLocationDetail.exceptions')}
          </h2>
          <div className="space-y-2">
            {locExceptions.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {ex.date} — {ex.reason}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ex.isClosed
                      ? t('adminLocationDetail.closed')
                      : `${formatTime(ex.openTime ?? '')}–${formatTime(ex.closeTime ?? '')}`}
                  </p>
                </div>
                <Badge color={ex.isClosed ? 'accent' : 'warm'}>
                  {ex.isClosed
                    ? t('adminLocationDetail.closed')
                    : t('adminLocationDetail.modified')}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
