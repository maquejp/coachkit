import { useEffect, useState } from 'react';
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
      <SEO title="Mark Attendance" description="Mark attendance for your classes." />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="mt-1 text-gray-500">Take attendance for your classes.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <FormField label="Select Class">
          <select
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            value={scheduleIdParam}
            onChange={(e) => {
              setSearchParams({ scheduleId: e.target.value });
            }}
          >
            <option value="">Choose a class...</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.classTypeId} — {s.startTime} ({s.dayOfWeek})
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Date">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </FormField>
      </div>

      {scheduleIdParam && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Students ({confirmedBookings.length} unmarked, {attendedBookings.length} attended)
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              No bookings for this class on this date.
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
                    <Button size="sm">Mark Present</Button>
                  ) : b.status === 'attended' ? (
                    <span className="text-xs font-medium text-green-600">Attended</span>
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
