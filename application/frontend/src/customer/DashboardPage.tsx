import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const DAY_LABELS: Record<number, string> = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  7: 'Sunday',
};

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [pointCards, setPointCards] = useState<PointCardPurchase[]>([]);
  const [pointCardPlans, setPointCardPlans] = useState<PointCardPlan[]>([]);
  const [loading, setLoading] = useState(true);

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
      <SEO title="Dashboard" description="Your CoachKit dashboard." />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back
          {user && 'role' in user && (user as { firstName?: string }).firstName
            ? `, ${(user as { firstName: string }).firstName}`
            : ''}
        </h1>
        <p className="mt-1 text-gray-500">Here&apos;s an overview of your account.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Upcoming Bookings</span>
              <Link
                to="/dashboard/bookings"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
          }
        >
          {upcomingBookings.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              <p>No upcoming bookings.</p>
              <Link
                to="/book"
                className="mt-1 inline-block text-primary-600 hover:text-primary-700"
              >
                Book a class
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
                      <p className="text-sm font-medium text-gray-900">{ct?.name ?? 'Class'}</p>
                      <p className="text-xs text-gray-500">
                        {slot
                          ? `${DAY_LABELS[slot.dayOfWeek]}, ${slot.startTime} — ${slot.endTime}`
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
              <span className="font-semibold text-gray-900">Subscription</span>
              <Link
                to="/dashboard/subscription"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Manage
              </Link>
            </div>
          }
        >
          {activeSub && activeSubPlan ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Plan</span>
                <span className="font-medium text-gray-900">{activeSubPlan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <Badge color={statusBadgeColor(activeSub.status)}>{activeSub.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Started</span>
                <span className="text-sm text-gray-900">{formatDate(activeSub.startDate)}</span>
              </div>
              {activeSub.endDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Renews</span>
                  <span className="text-sm text-gray-900">{formatDate(activeSub.endDate)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Price</span>
                <span className="font-medium text-gray-900">
                  {formatCents(activeSubPlan.priceCents)}/{activeSubPlan.interval}
                </span>
              </div>
            </div>
          ) : subscriptions.length > 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              <p>Your subscription is {subscriptions[0].status}.</p>
              <Link
                to="/pricing"
                className="mt-1 inline-block text-primary-600 hover:text-primary-700"
              >
                View plans
              </Link>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-gray-400">
              <p>No active subscription.</p>
              <Link
                to="/pricing"
                className="mt-1 inline-block text-primary-600 hover:text-primary-700"
              >
                View plans
              </Link>
            </div>
          )}
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Point Cards</span>
              <Link to="/pricing" className="text-sm text-primary-600 hover:text-primary-700">
                Buy more
              </Link>
            </div>
          }
        >
          {pointCards.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              <p>No point cards.</p>
              <Link
                to="/pricing"
                className="mt-1 inline-block text-primary-600 hover:text-primary-700"
              >
                View packs
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
                        {plan?.name ?? 'Point Card'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {pc.sessionsRemaining} session{pc.sessionsRemaining !== 1 ? 's' : ''}{' '}
                        remaining
                        {pc.expiresAt ? ` · Expires ${formatDate(pc.expiresAt)}` : ''}
                      </p>
                    </div>
                    <Badge color="secondary">{pc.sessionsRemaining} left</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Recent Payments</span>
            </div>
          }
        >
          {myPayments.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              <p>No payment history.</p>
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
