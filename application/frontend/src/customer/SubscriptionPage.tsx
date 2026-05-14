import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth';
import {
  fetchMySubscriptionsApi,
  fetchSubscriptionPlansApi,
  cancelSubscriptionApi,
  changeSubscriptionPlanApi,
} from '@/api/customer';
import type { CustomerSubscription, SubscriptionPlan } from '@/types';

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
    case 'active':
      return 'green';
    case 'trial':
      return 'primary';
    case 'cancelled':
      return 'accent';
    case 'expired':
      return 'warm';
    default:
      return 'gray';
  }
}

export default function SubscriptionPage() {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const [cancelTarget, setCancelTarget] = useState<CustomerSubscription | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const [showChangePlan, setShowChangePlan] = useState(false);
  const [changingPlan, setChangingPlan] = useState(false);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const [subs, allPlans] = await Promise.all([
          fetchMySubscriptionsApi(user.id),
          fetchSubscriptionPlansApi(),
        ]);
        setSubscriptions(subs);
        setPlans(allPlans);
      } catch {
        // API errors are non-fatal; component renders empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const activeSub = subscriptions.find((s) => s.status === 'active');
  const activePlan = activeSub ? plans.find((p) => p.id === activeSub.planId) : null;

  async function handleCancel() {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const updated = await cancelSubscriptionApi(cancelTarget.id);
      setSubscriptions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  }

  async function handleChangePlan(newPlanId: string) {
    if (!activeSub) return;
    setChangingPlan(true);
    try {
      const updated = await changeSubscriptionPlanApi(activeSub.id, newPlanId);
      setSubscriptions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setShowChangePlan(false);
    } finally {
      setChangingPlan(false);
    }
  }

  if (loading) return <Spinner centered size="lg" />;

  return (
    <>
      <SEO
        title={t('seo.customerSubscriptionTitle')}
        description={t('seo.customerSubscriptionDescription')}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('customerSubscription.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('customerSubscription.subtitle')}</p>
      </div>

      {activeSub && activePlan ? (
        <div className="space-y-6">
          <Card
            header={
              <span className="font-semibold text-gray-900">
                {t('customerSubscription.currentPlan')}
              </span>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{activePlan.name}</p>
                  <p className="text-sm text-gray-500">{activePlan.description}</p>
                </div>
                <Badge color={statusBadgeColor(activeSub.status)}>{activeSub.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-500">{t('common.price')}</p>
                  <p className="font-medium text-gray-900">
                    {formatCents(activePlan.priceCents)}/{activePlan.interval}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('common.started')}</p>
                  <p className="font-medium text-gray-900">{formatDate(activeSub.startDate)}</p>
                </div>
                {activeSub.endDate && (
                  <div>
                    <p className="text-xs text-gray-500">{t('customerSubscription.renewal')}</p>
                    <p className="font-medium text-gray-900">{formatDate(activeSub.endDate)}</p>
                  </div>
                )}
                {activeSub.trialEnd && (
                  <div>
                    <p className="text-xs text-gray-500">{t('customerSubscription.trialEnds')}</p>
                    <p className="font-medium text-gray-900">{formatDate(activeSub.trialEnd)}</p>
                  </div>
                )}
              </div>

              {activePlan.features.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="mb-2 text-xs font-medium uppercase text-gray-500">
                    {t('customerSubscription.features')}
                  </p>
                  <ul className="space-y-1">
                    {activePlan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-primary-500">{'\u2713'}</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2 border-t border-gray-100 pt-4">
                <Button variant="outline" onClick={() => setShowChangePlan(true)}>
                  {t('customerSubscription.changePlan')}
                </Button>
                <Button variant="ghost" onClick={() => setCancelTarget(activeSub)}>
                  {t('customerSubscription.cancelSubscription')}
                </Button>
              </div>
            </div>
          </Card>

          <Card
            header={
              <span className="font-semibold text-gray-900">
                {t('customerSubscription.sessionUsage')}
              </span>
            }
          >
            {activeSub.sessionsLimit === null ? (
              <div className="py-4 text-center text-sm text-gray-500">
                <p className="font-medium text-gray-900">
                  {t('customerSubscription.sessionsUsed', { count: activeSub.sessionsUsed })}
                </p>
                <p className="mt-1">{t('customerSubscription.unlimitedPlan')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {t('customerSubscription.ofUsed', {
                      used: activeSub.sessionsUsed,
                      total: activeSub.sessionsLimit,
                    })}
                  </span>
                  <span className="font-medium text-gray-900">
                    {t('customerSubscription.remaining', {
                      count: activeSub.sessionsLimit - activeSub.sessionsUsed,
                    })}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-primary-500 transition-all"
                    style={{
                      width: `${Math.min(100, (activeSub.sessionsUsed / activeSub.sessionsLimit) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
      ) : subscriptions.length > 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            <p>{t('customerSubscription.yourSubscription', { status: subscriptions[0].status })}</p>
            <p className="mt-1">
              {t('common.started')} {formatDate(subscriptions[0].startDate)}
              {subscriptions[0].endDate
                ? ` · ${t('common.renews')} ${formatDate(subscriptions[0].endDate)}`
                : ''}
            </p>
            <Button className="mt-4" onClick={() => (window.location.href = '/pricing')}>
              {t('common.viewPlans')}
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            <p>{t('customerSubscription.noSubscription')}</p>
            <Button className="mt-4" onClick={() => (window.location.href = '/pricing')}>
              {t('common.viewPlans')}
            </Button>
          </div>
        </Card>
      )}

      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title={t('customerSubscription.cancelTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600">{t('customerSubscription.cancelBody')}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setCancelTarget(null)}>
            {t('common.keep')}
          </Button>
          <Button variant="accent" loading={cancelling} onClick={handleCancel}>
            {t('common.yesCancel')}
          </Button>
        </div>
      </Modal>

      <Modal
        open={showChangePlan}
        onClose={() => setShowChangePlan(false)}
        title={t('customerSubscription.changePlanTitle')}
        size="md"
      >
        <div className="space-y-3">
          {plans
            .filter((p) => p.isActive && p.id !== activeSub?.planId)
            .map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
              >
                <div>
                  <p className="font-medium text-gray-900">{plan.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatCents(plan.priceCents)}/{plan.interval}
                  </p>
                </div>
                <Button size="sm" loading={changingPlan} onClick={() => handleChangePlan(plan.id)}>
                  {t('customerSubscription.select')}
                </Button>
              </div>
            ))}
          {plans.filter((p) => p.isActive && p.id !== activeSub?.planId).length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400">
              {t('customerSubscription.noOtherPlans')}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
