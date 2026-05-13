import { Button } from '@/components/ui/Button';

interface PricingCardProps {
  planName: string;
  price: string;
  period?: string;
  features: string[];
  featured?: boolean;
  onCta?: () => void;
  ctaLabel?: string;
}

export default function PricingCard({
  planName,
  price,
  period,
  features,
  featured,
  onCta,
  ctaLabel,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white p-6 ${
        featured ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'
      }`}
    >
      {featured && (
        <span className="mb-3 inline-block rounded-full bg-primary-100 px-3 py-0.5 text-xs font-semibold text-primary-700">
          Most Popular
        </span>
      )}
      <h3 className="text-lg font-semibold text-gray-900">{planName}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold text-gray-900">{price}</span>
        {period && <span className="ml-1 text-sm text-gray-500">{period}</span>}
      </div>
      <ul className="mt-4 space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-primary-500"
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
            {f}
          </li>
        ))}
      </ul>
      {onCta && (
        <Button variant={featured ? 'primary' : 'outline'} className="mt-6 w-full" onClick={onCta}>
          {ctaLabel ?? 'Get Started'}
        </Button>
      )}
    </div>
  );
}
