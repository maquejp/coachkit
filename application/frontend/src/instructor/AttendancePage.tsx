import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth';
import { fetchInstructorSchedule, fetchInstructorAttendanceBookings } from '@/api/instructor';
import type { InstructorScheduleItem, InstructorBooking } from '@/api/instructor';
import type { InstructorUser } from '@/types';

export default function InstructorAttendancePage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user) as InstructorUser | null;
  const coachId = user?.coachId ?? null;

  const [searchParams, setSearchParams] = useSearchParams();
  const scheduleIdParam = searchParams.get('scheduleId') ?? '';

  const [schedules, setSchedules] = useState<InstructorScheduleItem[]>([]);
  const [bookings, setBookings] = useState<InstructorBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!coachId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const sched = await fetchInstructorSchedule(coachId);
        if (!cancelled) setSchedules(sched);
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
  }, [coachId]);

  useEffect(() => {
    if (!scheduleIdParam) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const bs = await fetchInstructorAttendanceBookings(scheduleIdParam, date);
        if (!cancelled) setBookings(bs);
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
  }, [scheduleIdParam, date]);

  if (loading) return <Spinner centered size="lg" />;

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const attendedBookings = bookings.filter((b) => b.status === 'attended');

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
            onChange={(e) => {
              setSearchParams({ scheduleId: e.target.value });
            }}
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

      {scheduleIdParam && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('instructorAttendance.students', {
                unmarked: confirmedBookings.length,
                attended: attendedBookings.length,
              })}
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              {t('instructorAttendance.noBookings')}
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        b.status === 'attended'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {b.user ? (b.user.firstName[0] + b.user.lastName[0]).toUpperCase() : 'G'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {b.user
                          ? `${b.user.firstName} ${b.user.lastName}`
                          : (b.guestEmail ?? 'Guest')}
                      </p>
                      <p className="text-xs text-gray-500">{b.status}</p>
                    </div>
                  </div>
                  {b.status === 'confirmed' ? (
                    <Button size="sm">{t('instructorAttendance.markPresent')}</Button>
                  ) : b.status === 'attended' ? (
                    <span className="text-xs font-medium text-green-600">
                      {t('instructorAttendance.attended')}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </>
  );
}
