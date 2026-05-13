import { Button } from '@/components/ui/Button';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  secondaryCtaLabel?: string;
  onSecondaryCtaClick?: () => void;
  className?: string;
}

export default function HeroSection({
  title,
  subtitle,
  ctaLabel,
  onCtaClick,
  secondaryCtaLabel,
  onSecondaryCtaClick,
  className = '',
}: HeroSectionProps) {
  return (
    <section
      className={`bg-gradient-to-br from-primary-50 via-white to-primary-50 py-24 ${className}`}
    >
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-gray-600">{subtitle}</p>}
        {(ctaLabel || secondaryCtaLabel) && (
          <div className="mt-8 flex items-center justify-center gap-4">
            {ctaLabel && (
              <Button size="lg" onClick={onCtaClick}>
                {ctaLabel}
              </Button>
            )}
            {secondaryCtaLabel && (
              <Button variant="outline" size="lg" onClick={onSecondaryCtaClick}>
                {secondaryCtaLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
