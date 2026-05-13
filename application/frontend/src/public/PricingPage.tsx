import PricingCard from '@/components/PricingCard';

const plans = [
  {
    planName: 'Drop-In',
    price: '$20',
    period: '/session',
    features: ['Single class access', 'No commitment', 'Valid for 30 days', 'Book online'],
    ctaLabel: 'Book Now',
  },
  {
    planName: 'Monthly',
    price: '$99',
    period: '/month',
    features: ['Unlimited classes', 'Priority booking', 'Free guest pass', 'Cancel anytime'],
    featured: true,
    ctaLabel: 'Start Free Trial',
  },
  {
    planName: 'Annual',
    price: '$899',
    period: '/year',
    features: ['Everything in Monthly', '2 months free', 'Exclusive workshops', 'Member events'],
    ctaLabel: 'Get Annual',
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-2 text-center text-4xl font-bold text-gray-900">Pricing</h1>
      <p className="mb-10 text-center text-gray-600">Choose the plan that fits your lifestyle.</p>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <PricingCard key={p.planName} {...p} />
        ))}
      </div>
    </div>
  );
}
