import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth';
import { useInstructorSchedule } from '@/hooks/useInstructorSchedule';
import type { InstructorUser } from '@/types';

const DAYS = [
  { num: 1, name: 'Monday' },
  { num: 2, name: 'Tuesday' },
  { num: 3, name: 'Wednesday' },
  { num: 4, name: 'Thursday' },
  { num: 5, name: 'Friday' },
  { num: 6, name: 'Saturday' },
  { num: 7, name: 'Sunday' },
];

function formatTime(time: string) {
  const [h, m] = time.split(':');
  const hour = Number(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export default function InstructorSchedulePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user) as InstructorUser | null;
  const coachId = user?.coachId ?? null;

  const { schedules, classTypes, locations, loading } = useInstructorSchedule(coachId);

  if (loading) return <Spinner centered size="lg" />;

  return (
    <>
      <SEO
        title={t('seo.instructorScheduleTitle')}
        description={t('seo.instructorScheduleDescription')}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('instructorSchedule.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('instructorSchedule.subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DAYS.map((day) => {
          const daySlots = schedules.filter((s) => s.dayOfWeek === day.num);
          return (
            <Card key={day.num}>
              <h3 className="mb-3 text-sm font-semibold text-gray-900">{day.name}</h3>
              {daySlots.length === 0 ? (
                <p className="py-4 text-center text-xs text-gray-400">
                  {t('instructorSchedule.noClasses')}
                </p>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => {
                    const ct = classTypes.find((c) => c.id === slot.classTypeId);
                    const loc = locations.find((l) => l.id === slot.locationId);
                    return (
                      <Link
                        key={slot.id}
                        to={`/instructor/attendance?scheduleId=${slot.id}`}
                        className="block rounded-lg p-2 transition-colors hover:opacity-80"
                        style={{ backgroundColor: ct?.color ? ct.color + '20' : '#f3f4f6' }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-gray-900">
                            {ct?.name ?? 'Class'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                          {loc && (
                            <>
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: loc.color }}
                              />
                              <span>{loc.name}</span>
                            </>
                          )}
                        </div>
                        <Badge color="green" className="mt-1">
                          {t('instructorSchedule.spots', { count: slot.maxCapacity })}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </>
  );
}
