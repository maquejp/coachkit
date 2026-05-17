import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDashboard } from '@/hooks/useDashboard';
import { useBookings } from '@/hooks/useBookings';
import { useLocations } from '@/hooks/useLocations';
import { useClassTypes } from '@/hooks/useClassTypes';
import { useWeeklySchedule } from '@/hooks/useWeeklySchedule';
import { formatCurrency } from '@/lib/format';

function pct(v: number) {
  return `${Math.round(v * 100)}%`;
}

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { kpis, charts, occupancy, loading } = useDashboard();
  const { data: bookings } = useBookings();
  const { data: locations } = useLocations();
  const { data: classTypes } = useClassTypes();
  const { data: schedules } = useWeeklySchedule();

  if (loading)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );

  const upcomingClasses = (bookings ?? []).filter((b) => b.status === 'confirmed').slice(0, 5);

  const maxRevenue = charts ? Math.max(...charts.revenueByMonth.map((r) => r.amountCents), 1) : 1;
  const maxPopularity = charts ? Math.max(...charts.classPopularity.map((c) => c.bookings), 1) : 1;
  const maxBookingsByDay = charts ? Math.max(...charts.bookingsByDay.map((d) => d.count), 1) : 1;

  return (
    <>
      <SEO title={t('seo.adminDashboardTitle')} description={t('seo.adminDashboardDescription')} />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('adminDashboard.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('adminDashboard.subtitle')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <p className="text-xs font-medium uppercase text-gray-500">
            {t('adminDashboard.totalBookings')}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{kpis?.totalBookings ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-gray-500">
            {t('adminDashboard.confirmed')}
          </p>
          <p className="mt-1 text-2xl font-bold text-green-600">{kpis?.confirmedBookings ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-gray-500">
            {t('adminDashboard.revenue')}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {kpis
              ? formatCurrency(kpis.revenueCents, 'EUR', false)
              : formatCurrency(0, 'EUR', false)}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-gray-500">
            {t('adminDashboard.activeMembers')}
          </p>
          <p className="mt-1 text-2xl font-bold text-primary-600">{kpis?.activeMembers ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-gray-500">
            {t('adminDashboard.occupancy')}
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {kpis ? pct(kpis.occupancyRate) : '0%'}
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card
          header={
            <span className="font-semibold text-gray-900">
              {t('adminDashboard.revenueByMonth')}
            </span>
          }
        >
          {charts ? (
            <div className="space-y-2">
              {charts.revenueByMonth.map((r) => (
                <div key={r.month} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-gray-500">{r.month}</span>
                  <div className="flex-1">
                    <div className="h-5 w-full rounded bg-gray-100">
                      <div
                        className="h-full rounded bg-primary-500"
                        style={{ width: `${(r.amountCents / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-16 text-right text-xs font-medium text-gray-700">
                    {formatCurrency(r.amountCents)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">{t('common.noData')}</div>
          )}
        </Card>

        <Card
          header={
            <span className="font-semibold text-gray-900">
              {t('adminDashboard.classPopularity')}
            </span>
          }
        >
          {charts ? (
            <div className="space-y-2">
              {charts.classPopularity.map((c) => (
                <div key={c.className} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-gray-500">{c.className}</span>
                  <div className="flex-1">
                    <div className="h-5 w-full rounded bg-gray-100">
                      <div
                        className="h-full rounded bg-accent-500"
                        style={{ width: `${(c.bookings / maxPopularity) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-8 text-right text-xs font-medium text-gray-700">
                    {c.bookings}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">{t('common.noData')}</div>
          )}
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                {t('adminDashboard.upcomingClasses')}
              </span>
            </div>
          }
        >
          {upcomingClasses.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              {t('adminDashboard.noUpcomingClasses')}
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((b) => {
                const ct = (classTypes ?? []).find((c) => c.id === b.classTypeId);
                const slot = (schedules ?? []).find((s) => s.id === b.scheduleId);
                const loc = slot ? (locations ?? []).find((l) => l.id === slot.locationId) : null;
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {ct?.name ?? t('common.classes')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {b.date}
                        {slot ? ` ${slot.startTime}—${slot.endTime}` : ''}
                        {loc ? (
                          <span className="inline-flex items-center gap-1">
                            <span> · </span>
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: loc.color }}
                            />
                            {loc.name}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card
          header={
            <span className="font-semibold text-gray-900">
              {t('adminDashboard.occupancyByClass')}
            </span>
          }
        >
          {occupancy ? (
            <div className="space-y-2">
              {occupancy.byClass.map((c) => (
                <div key={c.className} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-gray-500">{c.className}</span>
                  <div className="flex-1">
                    <div className="h-5 w-full rounded bg-gray-100">
                      <div
                        className="h-full rounded bg-secondary-500"
                        style={{ width: `${c.occupancy * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-10 text-right text-xs font-medium text-gray-700">
                    {pct(c.occupancy)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2 text-xs text-gray-500">
                {t('adminDashboard.peakDay', { day: occupancy.peakDay, time: occupancy.peakTime })}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">{t('common.noData')}</div>
          )}
        </Card>
      </div>

      {charts && charts.bookingsByDay.length > 0 && (
        <Card
          className="mt-6"
          header={
            <span className="font-semibold text-gray-900">
              {t('adminDashboard.dailyBookingsTrend')}
            </span>
          }
        >
          <div className="space-y-2">
            {charts.bookingsByDay.map((d) => (
              <div key={d.date} className="flex items-center gap-3">
                <span className="w-24 text-xs text-gray-500">
                  {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex-1">
                  <div className="h-5 w-full rounded bg-gray-100">
                    <div
                      className="h-full rounded bg-teal-500"
                      style={{ width: `${(d.count / maxBookingsByDay) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-6 text-right text-xs font-medium text-gray-700">{d.count}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
