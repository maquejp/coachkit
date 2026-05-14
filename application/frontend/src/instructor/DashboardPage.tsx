import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth';
import { fetchInstructorUpcoming, fetchInstructorStats } from '@/api/instructor';
import type { InstructorBooking, InstructorStats as Stats } from '@/api/instructor';
import type { InstructorUser } from '@/types';

export default function InstructorDashboardPage() {
  const user = useAuthStore((s) => s.user) as InstructorUser | null;
  const coachId = user?.coachId ?? null;

  const [stats, setStats] = useState<Stats | null>(null);
  const [upcoming, setUpcoming] = useState<InstructorBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!coachId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [s, u] = await Promise.all([
          fetchInstructorStats(coachId),
          fetchInstructorUpcoming(coachId),
        ]);
        if (!cancelled) {
          setStats(s);
          setUpcoming(u);
        }
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

  if (loading) return <Spinner centered size="lg" />;

  return (
    <>
      <SEO title="Instructor Dashboard" description="Your teaching dashboard." />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstName}</h1>
        <p className="mt-1 text-gray-500">Here's your teaching overview.</p>
      </div>

      {stats && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-sm text-gray-500">Upcoming Classes</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stats.upcomingClasses}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Classes This Week</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stats.classesThisWeek}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
          </Card>
        </div>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
          <Link
            to="/instructor/schedule"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View Schedule
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">No upcoming bookings.</div>
        ) : (
          <div className="space-y-2">
            {upcoming.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {b.user ? `${b.user.firstName} ${b.user.lastName}` : (b.guestEmail ?? 'Guest')}
                  </p>
                  <p className="text-xs text-gray-500">{b.bookingDate}</p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    b.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : b.status === 'attended'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
