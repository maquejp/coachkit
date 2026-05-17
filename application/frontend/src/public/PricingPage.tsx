import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import PricingCard from '@/components/PricingCard';
import { Card } from '@/components/ui/Card';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { usePointCardPlans } from '@/hooks/usePointCardPlans';
import { useClassTypes } from '@/hooks/useClassTypes';
import { formatCurrency } from '@/lib/format';

export default function PricingPage() {
  const { t } = useTranslation();
  const { data: subPlans } = useSubscriptionPlans();
  const { data: pcPlans } = usePointCardPlans();
  const { data: classTypes } = useClassTypes();

  const activePlans = (subPlans ?? [])
    .filter((p) => p.isActive)
    .map((p) => ({
      planName: p.name,
      price: formatCurrency(p.priceCents, 'EUR', false),
      period: p.interval === 'monthly' ? t('pricingPage.perMonth') : t('pricingPage.perYear'),
      features: p.features,
      featured: p.name === 'Monthly Unlimited',
      ctaLabel: p.trialDays > 0 ? t('pricingPage.startFreeTrial') : t('common.getStarted'),
    }));

  const activePointCards = (pcPlans ?? []).filter((pcp) => pcp.isActive);
  const singlePrice = (classTypes ?? [])
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
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {activePlans.map((plan, i) => (
            <PricingCard key={i} {...plan} />
          ))}
          {activePlans.length === 0 && (
            <Card>
              <div className="py-12 text-center text-sm text-gray-400">
                {t('pricingPage.noPlans')}
              </div>
            </Card>
          )}
        </div>
        <div className="mb-16">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            {t('pricingPage.pointCards')}
          </h2>
          {activePointCards.length === 0 ? (
            <Card>
              <div className="py-12 text-center text-sm text-gray-400">
                {t('pricingPage.noPointCards')}
              </div>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {activePointCards.map((pc) => (
                <Card key={pc.id} hover>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900">{pc.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">{pc.description}</p>
                    <p className="mt-4 text-3xl font-bold text-gray-900">
                      {formatCurrency(pc.priceCents)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('pricingPage.packInfo', {
                        sessions: pc.sessionsCount,
                        days: pc.validityDays,
                      })}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('pricingPage.dropIn')}</h2>
          <p className="text-gray-600">
            {t('pricingPage.dropInPrice', { price: formatCurrency(singlePrice) })}
          </p>
        </div>
      </div>
    </>
  );
}
