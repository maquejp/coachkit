import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuthStore } from '@/stores/auth';
import { useInstructorDashboard } from '@/hooks/useInstructorDashboard';
import type { InstructorUser } from '@/types';

export default function InstructorDashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user) as InstructorUser | null;
  const coachId = user?.coachId ?? null;

  const { stats, upcoming, loading } = useInstructorDashboard(coachId);

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );

  return (
    <>
      <SEO
        title={t('seo.instructorDashboardTitle')}
        description={t('seo.instructorDashboardDescription')}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('instructorDashboard.welcome', { name: user?.firstName })}
        </h1>
        <p className="mt-1 text-gray-500">{t('instructorDashboard.subtitle')}</p>
      </div>

      {stats && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-sm text-gray-500">{t('instructorDashboard.upcomingClasses')}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stats.upcomingClasses}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">{t('instructorDashboard.classesThisWeek')}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stats.classesThisWeek}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">{t('instructorDashboard.totalStudents')}</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
          </Card>
        </div>
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('instructorDashboard.upcomingBookings')}
          </h2>
          <Link
            to="/instructor/schedule"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {t('instructorDashboard.viewSchedule')}
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            {t('instructorDashboard.noUpcoming')}
          </div>
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
