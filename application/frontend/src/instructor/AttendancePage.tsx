import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/stores/auth';
import { addToast } from '@/stores/toast';
import { fetchInstructorSchedule } from '@/api/instructor';
import { useInstructorAttendance } from '@/hooks/useInstructorAttendance';
import type { InstructorScheduleItem } from '@/api/instructor';
import type { InstructorUser } from '@/types';

export default function InstructorAttendancePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user) as InstructorUser | null;
  const coachId = user?.coachId ?? null;
  const [searchParams, setSearchParams] = useSearchParams();
  const scheduleIdParam = searchParams.get('scheduleId') ?? '';
  const [schedules, setSchedules] = useState<InstructorScheduleItem[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const {
    data: bookings,
    loading,
    markAttendance,
    marking,
  } = useInstructorAttendance(scheduleIdParam, date);

  useEffect(() => {
    if (!coachId) return;
    (async () => {
      setLoadingSchedules(true);
      try {
        setSchedules(await fetchInstructorSchedule(coachId));
      } catch {
        addToast('error', t('common.loadingError'));
      } finally {
        setLoadingSchedules(false);
      }
    })();
  }, [coachId]);

  if (loadingSchedules || loading) return <Skeleton variant="card" />;

  const confirmedBookings = (bookings ?? []).filter((b) => b.status === 'confirmed');
  const attendedBookings = (bookings ?? []).filter((b) => b.status === 'attended');

  return (
    <>
      <SEO
        title={t('seo.instructorAttendanceTitle')}
        description={t('seo.instructorAttendanceDescription')}
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('instructorAttendance.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('instructorAttendance.subtitle')}</p>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <FormField label={t('instructorAttendance.selectClass')}>
          <select
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            value={scheduleIdParam}
            onChange={(e) => setSearchParams({ scheduleId: e.target.value })}
          >
            <option value="">{t('instructorAttendance.chooseClass')}</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.classTypeId} — {s.startTime} ({s.dayOfWeek})
              </option>
            ))}
          </select>
        </FormField>
        <FormField label={t('instructorAttendance.date')}>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </FormField>
      </div>
      {!scheduleIdParam ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('instructorAttendance.selectPrompt')}
          </div>
        </Card>
      ) : bookings?.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('instructorAttendance.noBookings')}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {confirmedBookings.length > 0 && (
            <Card
              header={
                <span className="font-semibold text-gray-900">
                  {t('instructorAttendance.pending')} ({confirmedBookings.length})
                </span>
              }
            >
              <div className="space-y-2">
                {confirmedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {b.user
                          ? `${b.user.firstName} ${b.user.lastName}`
                          : (b.guestEmail ?? t('common.anonymous'))}
                      </p>
                      {b.guestEmail && (
                        <p className="text-xs text-gray-500">{t('instructorAttendance.guest')}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => markAttendance(b.id, 'attended')}
                      loading={marking}
                    >
                      {t('instructorAttendance.markAttended')}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {attendedBookings.length > 0 && (
            <Card
              header={
                <span className="font-semibold text-gray-900">
                  {t('instructorAttendance.attended')} ({attendedBookings.length})
                </span>
              }
            >
              <div className="space-y-2">
                {attendedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {b.user
                          ? `${b.user.firstName} ${b.user.lastName}`
                          : (b.guestEmail ?? t('common.anonymous'))}
                      </p>
                      <p className="text-xs text-green-600">
                        {t('instructorAttendance.checkedIn')}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAttendance(b.id, 'absent')}
                      loading={marking}
                    >
                      {t('instructorAttendance.markAbsent')}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
