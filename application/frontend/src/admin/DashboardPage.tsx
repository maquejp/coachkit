import { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { fetchDashboardKpis, fetchDashboardCharts, fetchDashboardOccupancy } from '@/api/admin';
import type { Kpis, ChartsData, OccupancyData } from '@/api/admin';
import { bookings, classTypes, weeklySchedule, locations } from '@/mocks/fixtures';

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(0)}`;
}

function pct(v: number) {
  return `${Math.round(v * 100)}%`;
}

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [charts, setCharts] = useState<ChartsData | null>(null);
  const [occupancy, setOccupancy] = useState<OccupancyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [k, c, o] = await Promise.all([
          fetchDashboardKpis(),
          fetchDashboardCharts(),
          fetchDashboardOccupancy(),
        ]);
        setKpis(k);
        setCharts(c);
        setOccupancy(o);
      } catch {
        // API errors are non-fatal; component renders with null data
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Spinner centered size="lg" />;

  const upcomingClasses = bookings.filter((b) => b.status === 'confirmed').slice(0, 5);

  const maxRevenue = charts ? Math.max(...charts.revenueByMonth.map((r) => r.amountCents), 1) : 1;
  const maxPopularity = charts ? Math.max(...charts.classPopularity.map((c) => c.bookings), 1) : 1;

  return (
    <>
      <SEO title="Admin Dashboard" description="Admin dashboard overview." />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-500">Studio overview and performance metrics.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <p className="text-xs font-medium uppercase text-gray-500">Total Bookings</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{kpis?.totalBookings ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-gray-500">Confirmed</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{kpis?.confirmedBookings ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-gray-500">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {kpis ? formatCents(kpis.revenueCents) : '$0'}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-gray-500">Active Members</p>
          <p className="mt-1 text-2xl font-bold text-primary-600">{kpis?.activeMembers ?? 0}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-gray-500">Occupancy</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {kpis ? pct(kpis.occupancyRate) : '0%'}
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card header={<span className="font-semibold text-gray-900">Revenue by Month</span>}>
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
                    {formatCents(r.amountCents)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">No data</div>
          )}
        </Card>

        <Card header={<span className="font-semibold text-gray-900">Class Popularity</span>}>
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
            <div className="py-8 text-center text-sm text-gray-400">No data</div>
          )}
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Upcoming Classes</span>
            </div>
          }
        >
          {upcomingClasses.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">No upcoming classes.</div>
          ) : (
            <div className="space-y-3">
              {upcomingClasses.map((b) => {
                const ct = classTypes.find((c) => c.id === b.classTypeId);
                const slot = weeklySchedule.find((s) => s.id === b.scheduleId);
                const loc = slot ? locations.find((l) => l.id === slot.locationId) : null;
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{ct?.name ?? 'Class'}</p>
                      <p className="text-xs text-gray-500">
                        {b.date}
                        {slot ? ` ${slot.startTime}—${slot.endTime}` : ''}
                        {loc ? ` · ${loc.name}` : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card header={<span className="font-semibold text-gray-900">Occupancy by Class</span>}>
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
                Peak day: {occupancy.peakDay} · Peak time: {occupancy.peakTime}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">No data</div>
          )}
        </Card>
      </div>
    </>
  );
}
