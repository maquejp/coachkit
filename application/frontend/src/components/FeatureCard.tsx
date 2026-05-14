import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  linkTo?: string;
  linkLabel?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  linkTo,
  linkLabel,
}: FeatureCardProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-card-hover">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
      {linkTo && (
        <Link
          to={linkTo}
          className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {linkLabel ?? t('featureCard.learnMore')} &rarr;
        </Link>
      )}
    </div>
  );
}
