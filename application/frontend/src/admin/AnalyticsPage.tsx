import { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { fetchAnalytics } from '@/api/admin';
import type { AnalyticsData } from '@/api/admin';

function formatPct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const result = await fetchAnalytics();
        if (!cancelled) setData(result);
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
  }, []);

  return (
    <>
      <SEO title="Analytics" description="Website and business analytics." />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-gray-500">
          Track conversion, popular classes, peak times, and referral sources.
        </p>
      </div>

      {loading ? (
        <Spinner centered size="lg" />
      ) : !data ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            No analytics data available.
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <Card>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{formatPct(data.conversionRate)}</p>
                <p className="text-xs text-gray-500">Conversion Rate</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{formatPct(data.bounceRate)}</p>
                <p className="text-xs text-gray-500">Bounce Rate</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(data.avgSessionDuration)}
                </p>
                <p className="text-xs text-gray-500">Avg. Session</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {data.totalPageViews.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Page Views</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {data.uniqueVisitors.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Unique Visitors</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Popular Classes</h3>
              <div className="space-y-3">
                {data.popularClasses.map((c) => (
                  <div key={c.className} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{c.className}</span>
                    <div className="text-right text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{c.bookings}</span> bookings
                      &middot; {formatCurrency(c.revenueCents)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Peak Booking Times</h3>
              <div className="space-y-3">
                {data.peakBookingTimes.map((t) => (
                  <div key={t.timeSlot}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-gray-700">{t.timeSlot}</span>
                      <span className="text-gray-500">{t.percentage}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: `${t.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Referral Sources</h3>
            <div className="space-y-3">
              {data.referralSources.map((r) => (
                <div key={r.source}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-700">{r.source}</span>
                    <span className="text-gray-500">
                      {r.count.toLocaleString()} ({r.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
