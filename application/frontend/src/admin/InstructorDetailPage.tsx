import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { useCoaches } from '@/hooks/useCoaches';
import { useWeeklySchedule } from '@/hooks/useWeeklySchedule';
import { useClassTypes } from '@/hooks/useClassTypes';
import { useLocations } from '@/hooks/useLocations';

function formatTime(time: string) {
  const [h, m] = time.split(':');
  const hour = Number(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return h12 + ':' + m + ' ' + ampm;
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function InstructorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: coaches, loading: coachesLoading } = useCoaches();
  const { data: schedules, loading: schedLoading } = useWeeklySchedule();
  const { data: classTypes, loading: ctLoading } = useClassTypes();
  const { data: locations, loading: locLoading } = useLocations();

  const coach = useMemo(() => (coaches ?? []).find((c) => c.id === id) ?? null, [coaches, id]);
  const coachSchedules = useMemo(
    () => (schedules ?? []).filter((s) => s.coachId === id),
    [schedules, id],
  );

  const loading = coachesLoading || schedLoading || ctLoading || locLoading;

  if (loading) return <Spinner centered size="lg" />;
  if (!coach) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">{t('adminInstructorDetail.instructorNotFound')}</p>
        <Link
          to="/admin/instructors"
          className="mt-2 inline-block text-sm text-primary-600 hover:underline"
        >
          {t('adminInstructorDetail.backToInstructors')}
        </Link>
      </div>
    );
  }

  const groupedSchedules = DAY_NAMES.map((name, idx) => ({
    day: name,
    dayNum: idx + 1,
    slots: coachSchedules.filter((s) => s.dayOfWeek === idx + 1),
  }));
  const hasSchedule = coachSchedules.length > 0;

  return (
    <>
      <SEO title={coach.name} description={t('seo.adminInstructorsDescription')} />
      <div className="mb-6">
        <Link to="/admin/instructors" className="text-sm text-primary-600 hover:underline">
          {t('adminInstructorDetail.backToInstructors')}
        </Link>
      </div>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
            {coach.name
              .split(' ')
              .map((s) => s[0])
              .join('')}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{coach.name}</h1>
            <p className="text-gray-500">{coach.email}</p>
          </div>
        </div>
        <Badge color={coach.isActive ? 'green' : 'gray'}>
          {coach.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      </div>
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            {t('adminInstructorDetail.bio')}
          </h2>
          <p className="text-sm text-gray-600">{coach.bio}</p>
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">
            {t('adminInstructorDetail.contact')}
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-700">{t('adminInstructorDetail.email')}</span>{' '}
              {coach.email}
            </p>
            <p>
              <span className="font-medium text-gray-700">{t('adminInstructorDetail.phone')}</span>{' '}
              {coach.phone ?? '\u2014'}
            </p>
            <p>
              <span className="font-medium text-gray-700">
                {t('adminInstructorDetail.weeklySlots')}
              </span>{' '}
              {coachSchedules.length}
            </p>
          </div>
        </Card>
      </div>
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t('adminInstructorDetail.schedule')}
        </h2>
        {!hasSchedule ? (
          <div className="py-8 text-center text-sm text-gray-400">
            {t('adminInstructorDetail.noSchedule')}
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
                        const loc = (locations ?? []).find((l) => l.id === slot.locationId);
                        return (
                          <div
                            key={slot.id}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm"
                            style={{ backgroundColor: ct?.color ? ct.color + '20' : '#f9fafb' }}
                          >
                            <span className="font-medium text-gray-900">
                              {ct?.name ?? t('common.classes')}
                            </span>
                            <span className="text-gray-500">
                              {formatTime(slot.startTime)}-{formatTime(slot.endTime)}
                            </span>
                            {loc && (
                              <div className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: loc.color }}
                                />
                                <span>{loc.name}</span>
                              </div>
                            )}
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
    </>
  );
}
