import PricingCard from '@/components/PricingCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { subscriptionPlans, pointCardPlans, classTypes } from '@/mocks/fixtures';

export default function PricingPage() {
  const activePlans = subscriptionPlans
    .filter((sp) => sp.isActive)
    .map((p) => ({
      planName: p.name,
      price: `$${(p.priceCents / 100).toFixed(0)}`,
      period: p.interval === 'monthly' ? '/month' : '/year',
      features: p.features,
      featured: p.name === 'Monthly Unlimited',
      ctaLabel: p.trialDays > 0 ? 'Start Free Trial' : 'Get Started',
    }));

  const activePointCards = pointCardPlans.filter((pcp) => pcp.isActive);
  const singlePrice = classTypes
    .filter((ct) => ct.isActive)
    .reduce((min, ct) => Math.min(min, ct.defaultPriceCents), Infinity);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-2 text-center text-4xl font-bold text-gray-900">Pricing</h1>
      <p className="mb-10 text-center text-gray-600">Choose the plan that fits your lifestyle.</p>

      <h2 className="mb-6 text-2xl font-bold text-gray-900">Membership Plans</h2>
      <div className="mb-16 grid gap-6 md:grid-cols-3">
        {activePlans.map((p) => (
          <PricingCard key={p.planName} {...p} />
        ))}
      </div>

      <h2 className="mb-6 text-2xl font-bold text-gray-900">Class Packs</h2>
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
                {pcp.sessionsCount} sessions
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
                Valid {pcp.validityDays} days
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mb-6 text-2xl font-bold text-gray-900">Single Session</h2>
      <Card className="max-w-sm p-6">
        <p className="text-sm text-gray-500">Drop in for a single class</p>
        <div className="mt-2">
          <span className="text-3xl font-bold text-gray-900">
            ${(singlePrice / 100).toFixed(0)}
          </span>
          <span className="ml-1 text-sm text-gray-500">/session</span>
        </div>
        <p className="mt-2 text-sm text-gray-500">Plus insurance fee where applicable.</p>
        <Badge color="green" className="mt-3">
          No commitment
        </Badge>
      </Card>
    </div>
  );
}
