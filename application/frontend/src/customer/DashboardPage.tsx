import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth';
import {
  fetchMyBookingsApi,
  fetchMySubscriptionsApi,
  fetchMyPointCardsApi,
  fetchSubscriptionPlansApi,
  fetchPointCardPlansApi,
} from '@/api/customer';
import { classTypes, weeklySchedule, locations, paymentTransactions } from '@/mocks/fixtures';
import type {
  Booking,
  CustomerSubscription,
  PointCardPurchase,
  SubscriptionPlan,
  PointCardPlan,
} from '@/types';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [pointCards, setPointCards] = useState<PointCardPurchase[]>([]);
  const [pointCardPlans, setPointCardPlans] = useState<PointCardPlan[]>([]);
  const [loading, setLoading] = useState(true);

  function dayLabel(dayOfWeek: number): string {
    const map: Record<number, string> = {
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
      7: 'sunday',
    };
    return t(`bookingPage.days.${map[dayOfWeek]}`);
  }

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const [bks, subs, pcs, splans, pcplans] = await Promise.all([
          fetchMyBookingsApi(user.id),
          fetchMySubscriptionsApi(user.id),
          fetchMyPointCardsApi(user.id),
          fetchSubscriptionPlansApi(),
          fetchPointCardPlansApi(),
        ]);
        setBookings(bks);
        setSubscriptions(subs);
        setPointCards(pcs);
        setSubscriptionPlans(splans);
        setPointCardPlans(pcplans);
      } catch {
        // API errors are non-fatal; component renders with null/empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) return <Spinner centered size="lg" />;

  const activeSub = subscriptions.find((s) => s.status === 'active');
  const activeSubPlan = activeSub ? subscriptionPlans.find((p) => p.id === activeSub.planId) : null;

  const myPayments = paymentTransactions
    .filter((p) => p.userId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed').slice(0, 5);

  return (
    <>
      <SEO
        title={t('seo.customerDashboardTitle')}
        description={t('seo.customerDashboardDescription')}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('customerDashboard.welcomeBack')}
          {user && 'role' in user && (user as { firstName?: string }).firstName
            ? `, ${(user as { firstName: string }).firstName}`
            : ''}
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
            <div className="py-8 text-center text-sm text-gray-400">
              <p>{t('customerDashboard.noUpcomingBookings')}</p>
              <Link
                to="/book"
                className="mt-1 inline-block text-primary-600 hover:text-primary-700"
              >
                {t('customerDashboard.bookAClass')}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((b) => {
                const ct = classTypes.find((c) => c.id === b.classTypeId);
                const slot = weeklySchedule.find((s) => s.id === b.scheduleId);
                const loc = slot ? locations.find((l) => l.id === slot.locationId) : null;
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
                        {slot
                          ? `${dayLabel(slot.dayOfWeek)}, ${slot.startTime} — ${slot.endTime}`
                          : b.date}
                        {loc ? ` · ${loc.name}` : ''}
                      </p>
                    </div>
                    <Badge color={statusBadgeColor(b.status)}>{b.status}</Badge>
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
                  {formatCents(activeSubPlan.priceCents)}/{activeSubPlan.interval}
                </span>
              </div>
            </div>
          ) : subscriptions.length > 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              <p>{t('customerDashboard.yourSubscription', { status: subscriptions[0].status })}</p>
              <Link
                to="/pricing"
                className="mt-1 inline-block text-primary-600 hover:text-primary-700"
              >
                {t('common.viewPlans')}
              </Link>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              <p>{t('common.noSubscription')}</p>
              <Link
                to="/pricing"
                className="mt-1 inline-block text-primary-600 hover:text-primary-700"
              >
                {t('common.viewPlans')}
              </Link>
            </div>
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
          {pointCards.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              <p>{t('customerDashboard.noPointCards')}</p>
              <Link
                to="/pricing"
                className="mt-1 inline-block text-primary-600 hover:text-primary-700"
              >
                {t('customerDashboard.viewPacks')}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {pointCards.map((pc) => {
                const plan = pointCardPlans.find((p) => p.id === pc.planId);
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
            <div className="py-8 text-center text-sm text-gray-400">
              <p>{t('customerDashboard.noPayments')}</p>
            </div>
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
                      {formatCents(p.amountCents)}
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
