import { Link, useLocation } from 'react-router-dom';

const labelMap: Record<string, string> = {
  admin: 'Admin',
  classes: 'Classes',
  schedule: 'Schedule',
  customers: 'Customers',
  analytics: 'Analytics',
  settings: 'Settings',
  dashboard: 'Dashboard',
  bookings: 'Bookings',
  subscription: 'Subscription',
  profile: 'Profile',
  pricing: 'Pricing',
  about: 'About',
  contact: 'Contact',
};

export default function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500">
      <Link to="/" className="hover:text-primary-600">
        Home
      </Link>
      {segments.map((seg, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const label = labelMap[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
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
