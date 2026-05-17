import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth';
import { logoutApi } from '@/api/auth';
import Logo from './Logo';
import MobileNav from './MobileNav';
import LanguageSwitcher from './LanguageSwitcher';

const navLinkDefs = [
  { to: '/', i18nKey: 'common.home' },
  { to: '/classes', i18nKey: 'common.classes' },
  { to: '/pricing', i18nKey: 'common.pricing' },
  { to: '/about', i18nKey: 'common.about' },
  { to: '/contact', i18nKey: 'common.contact' },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuth = !!token && !!user;
  const navLinks = navLinkDefs.map((link) => ({ to: link.to, label: t(link.i18nKey) }));

  async function handleLogout() {
    try {
      await logoutApi();
    } catch {
      /* ignore — clear auth regardless */
    }
    useAuthStore.getState().clearAuth();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-600"
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher />
          {isAuth ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  navigate(
                    user.role === 'admin'
                      ? '/admin'
                      : user.role === 'instructor'
                        ? '/instructor'
                        : '/dashboard',
                  )
                }
                className="flex items-center rounded-full p-1 text-sm transition-colors hover:bg-gray-100"
                title={user.fullName ?? user.email}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                  {initials(user.fullName ?? user.email)}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                title={t('header.signOutTitle')}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                {t('common.signIn')}
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                {t('common.getStarted')}
              </Button>
            </>
          )}
        </nav>

        <button
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </header>
  );
}
