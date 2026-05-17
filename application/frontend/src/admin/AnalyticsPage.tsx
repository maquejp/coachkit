import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAnalytics } from '@/hooks/useAnalytics';

function formatPct(n: number) {
  return (n * 100).toFixed(1) + '%';
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + 'm ' + s + 's';
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const { data, loading } = useAnalytics();

  return (
    <>
      <SEO title={t('seo.adminAnalyticsTitle')} description={t('seo.adminAnalyticsDescription')} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('adminAnalytics.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('adminAnalytics.subtitle')}</p>
      </div>
      {loading ? (
        <Skeleton variant="card" />
      ) : !data ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminAnalytics.noData')}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <Card>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{formatPct(data.conversionRate)}</p>
                <p className="text-xs text-gray-500">{t('adminAnalytics.conversionRate')}</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{formatPct(data.bounceRate)}</p>
                <p className="text-xs text-gray-500">{t('adminAnalytics.bounceRate')}</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(data.avgSessionDuration)}
                </p>
                <p className="text-xs text-gray-500">{t('adminAnalytics.avgSession')}</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {data.totalPageViews.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{t('adminAnalytics.pageViews')}</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {data.uniqueVisitors.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{t('adminAnalytics.uniqueVisitors')}</p>
              </div>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                {t('adminAnalytics.popularClasses')}
              </h3>
              <div className="space-y-3">
                {data.popularClasses.map((c) => (
                  <div key={c.className} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{c.className}</span>
                    <div className="text-right text-sm text-gray-500">
                      {t('adminAnalytics.classInfo', {
                        bookings: c.bookings,
                        revenue: formatCurrency(c.revenueCents),
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                {t('adminAnalytics.peakTimes')}
              </h3>
              <div className="space-y-3">
                {data.peakBookingTimes.map((tItem) => (
                  <div key={tItem.timeSlot}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-gray-700">{tItem.timeSlot}</span>
                      <span className="text-gray-500">{tItem.percentage}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-primary-500"
                        style={{ width: tItem.percentage + '%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              {t('adminAnalytics.referralSources')}
            </h3>
            <div className="space-y-3">
              {data.referralSources.map((r) => (
                <div key={r.source}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-700">{r.source}</span>
                    <span className="text-gray-500">
                      {t('adminAnalytics.referralInfo', {
                        count: r.count,
                        percentage: r.percentage,
                      })}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{ width: r.percentage + '%' }}
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
