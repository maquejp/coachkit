import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { useAuthStore } from '@/stores/auth';
import { useBookings } from '@/hooks/useBookings';
import { useCustomerSubscriptions } from '@/hooks/useCustomerSubscriptions';
import { usePointCardPurchases } from '@/hooks/usePointCardPurchases';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { usePointCardPlans } from '@/hooks/usePointCardPlans';
import type { PaymentTransaction } from '@/types';
import { formatCurrency } from '@/lib/format';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function statusBadgeColor(status: string) {
  switch (status) {
    case 'confirmed':
      return 'green';
    case 'attended':
      return 'secondary';
    case 'cancelled':
      return 'accent';
    case 'no-show':
      return 'warm';
    case 'active':
      return 'green';
    case 'cancelled_sub':
      return 'accent';
    case 'expired':
      return 'warm';
    case 'pending':
      return 'warm';
    case 'succeeded':
      return 'green';
    case 'refunded':
      return 'accent';
    case 'failed':
      return 'accent';
    default:
      return 'warm';
  }
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const { data: bookings } = useBookings(user?.id);
  const { data: subscriptions } = useCustomerSubscriptions(user?.id);
  const { data: pointCards } = usePointCardPurchases(user?.id);
  const { data: subscriptionPlans } = useSubscriptionPlans();
  const { data: pointCardPlans } = usePointCardPlans();

  const loading = !user;
  const bks = bookings ?? [];
  const subs = subscriptions ?? [];
  const pcs = pointCards ?? [];
  const splans = subscriptionPlans ?? [];
  const pcplans = pointCardPlans ?? [];

  const activeSub = subs.find((s) => s.status === 'active');
  const activeSubPlan = activeSub ? splans.find((p) => p.id === activeSub.planId) : null;
  const upcomingBookings = bks.filter((b) => b.status === 'confirmed').slice(0, 5);
  const myPayments: PaymentTransaction[] = [];

  if (loading)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );

  return (
    <>
      <SEO
        title={t('seo.customerDashboardTitle')}
        description={t('seo.customerDashboardDescription')}
      />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('customerDashboard.welcomeBack')}
          {user && 'firstName' in user ? `, ${(user as { firstName: string }).firstName}` : ''}
        </h1>
        <p className="mt-1 text-gray-500">{t('customerDashboard.overview')}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                {t('customerDashboard.upcomingBookings')}
              </span>
              <Link
                to="/dashboard/bookings"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {t('common.viewAll')}
              </Link>
            </div>
          }
        >
          {upcomingBookings.length === 0 ? (
            <EmptyState
              message={t('customerDashboard.noUpcomingBookings')}
              action={
                <Link
                  to="/book"
                  className="mt-1 inline-block text-primary-600 hover:text-primary-700"
                >
                  {t('customerDashboard.bookAClass')}
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{b.classTypeId}</p>
                    <p className="text-xs text-gray-500">{b.date}</p>
                  </div>
                  <Badge color={statusBadgeColor(b.status)}>{b.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                {t('customerDashboard.subscriptionCard')}
              </span>
              <Link
                to="/dashboard/subscription"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {t('customerDashboard.manage')}
              </Link>
            </div>
          }
        >
          {activeSub && activeSubPlan ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{t('common.plan')}</span>
                <span className="font-medium text-gray-900">{activeSubPlan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{t('common.status')}</span>
                <Badge color={statusBadgeColor(activeSub.status)}>{activeSub.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{t('common.started')}</span>
                <span className="text-sm text-gray-900">{formatDate(activeSub.startDate)}</span>
              </div>
              {activeSub.endDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{t('common.renews')}</span>
                  <span className="text-sm text-gray-900">{formatDate(activeSub.endDate)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{t('common.price')}</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(activeSubPlan.priceCents)}/{activeSubPlan.interval}
                </span>
              </div>
            </div>
          ) : subs.length > 0 ? (
            <EmptyState
              message={t('customerDashboard.yourSubscription', { status: subs[0].status })}
              action={
                <Link
                  to="/pricing"
                  className="mt-1 inline-block text-primary-600 hover:text-primary-700"
                >
                  {t('common.viewPlans')}
                </Link>
              }
            />
          ) : (
            <EmptyState
              message={t('common.noSubscription')}
              action={
                <Link
                  to="/pricing"
                  className="mt-1 inline-block text-primary-600 hover:text-primary-700"
                >
                  {t('common.viewPlans')}
                </Link>
              }
            />
          )}
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                {t('customerDashboard.pointCards')}
              </span>
              <Link to="/pricing" className="text-sm text-primary-600 hover:text-primary-700">
                {t('customerDashboard.buyMore')}
              </Link>
            </div>
          }
        >
          {pcs.length === 0 ? (
            <EmptyState
              message={t('customerDashboard.noPointCards')}
              action={
                <Link
                  to="/pricing"
                  className="mt-1 inline-block text-primary-600 hover:text-primary-700"
                >
                  {t('customerDashboard.viewPacks')}
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {pcs.map((pc) => {
                const plan = pcplans.find((p) => p.id === pc.planId);
                return (
                  <div
                    key={pc.id}
                    className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {plan?.name ?? t('customerDashboard.pointCards')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t('customerDashboard.sessionsRemaining', { count: pc.sessionsRemaining })}
                        {pc.expiresAt
                          ? ` · ${t('common.expires')} ${formatDate(pc.expiresAt)}`
                          : ''}
                      </p>
                    </div>
                    <Badge color="secondary">
                      {t('customerDashboard.sessionsLeft', { count: pc.sessionsRemaining })}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                {t('customerDashboard.recentPayments')}
              </span>
            </div>
          }
        >
          {myPayments.length === 0 ? (
            <EmptyState message={t('customerDashboard.noPayments')} />
          ) : (
            <div className="space-y-3">
              {myPayments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(p.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(p.amountCents)}
                    </p>
                    <Badge color={statusBadgeColor(p.status)}>{p.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
