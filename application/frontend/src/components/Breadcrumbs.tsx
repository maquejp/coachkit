import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const labelMap: Record<string, string> = {
  admin: 'breadcrumbs.admin',
  classes: 'common.classes',
  schedule: 'common.schedule',
  customers: 'common.customers',
  analytics: 'common.analytics',
  settings: 'common.settings',
  dashboard: 'common.dashboard',
  bookings: 'common.bookings',
  subscription: 'common.subscription',
  profile: 'common.profile',
  pricing: 'common.pricing',
  about: 'common.about',
  contact: 'common.contact',
};

export default function Breadcrumbs() {
  const { t } = useTranslation();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500">
      <Link to="/" className="hover:text-primary-600">
        {t('common.home')}
      </Link>
      {segments.map((seg, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const labelKey = labelMap[seg];
        const label = labelKey ? t(labelKey) : seg.charAt(0).toUpperCase() + seg.slice(1);
        const isLast = i === segments.length - 1;

        return (
          <span key={path} className="flex items-center gap-1.5">
            <svg
              className="h-3 w-3 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {isLast ? (
              <span className="font-medium text-gray-800">{label}</span>
            ) : (
              <Link to={path} className="hover:text-primary-600">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
