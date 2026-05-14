import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import PricingCard from '@/components/PricingCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { subscriptionPlans, pointCardPlans, classTypes } from '@/mocks/fixtures';

export default function PricingPage() {
  const { t } = useTranslation();

  const activePlans = subscriptionPlans
    .filter((sp) => sp.isActive)
    .map((p) => ({
      planName: p.name,
      price: `$${(p.priceCents / 100).toFixed(0)}`,
      period: p.interval === 'monthly' ? t('pricingPage.perMonth') : t('pricingPage.perYear'),
      features: p.features,
      featured: p.name === 'Monthly Unlimited',
      ctaLabel: p.trialDays > 0 ? t('pricingPage.startFreeTrial') : t('common.getStarted'),
    }));

  const activePointCards = pointCardPlans.filter((pcp) => pcp.isActive);
  const singlePrice = classTypes
    .filter((ct) => ct.isActive)
    .reduce((min, ct) => Math.min(min, ct.defaultPriceCents), Infinity);

  return (
    <>
      <SEO
        title={t('seo.pricingTitle')}
        description={t('seo.pricingDescription')}
        canonical="https://coachkit.app/pricing"
      />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="mb-2 text-center text-4xl font-bold text-gray-900">
          {t('pricingPage.heading')}
        </h1>
        <p className="mb-10 text-center text-gray-600">{t('pricingPage.subtitle')}</p>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          {t('pricingPage.membershipPlans')}
        </h2>
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {activePlans.map((p) => (
            <PricingCard key={p.planName} {...p} />
          ))}
        </div>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('pricingPage.classPacks')}</h2>
        <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activePointCards.map((pcp) => (
            <Card key={pcp.id} className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">{pcp.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{pcp.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${(pcp.priceCents / 100).toFixed(0)}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {t('pricingPage.sessionsCount', { count: pcp.sessionsCount })}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {t('pricingPage.validDays', { days: pcp.validityDays })}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <h2 className="mb-6 text-2xl font-bold text-gray-900">{t('pricingPage.singleSession')}</h2>
        <Card className="max-w-sm p-6">
          <p className="text-sm text-gray-500">{t('pricingPage.dropIn')}</p>
          <div className="mt-2">
            <span className="text-3xl font-bold text-gray-900">
              ${(singlePrice / 100).toFixed(0)}
            </span>
            <span className="ml-1 text-sm text-gray-500">{t('pricingPage.perSession')}</span>
          </div>
          <p className="mt-2 text-sm text-gray-500">{t('pricingPage.disclaimer')}</p>
          <Badge color="green" className="mt-3">
            {t('pricingPage.noCommitment')}
          </Badge>
        </Card>
      </div>
    </>
  );
}
