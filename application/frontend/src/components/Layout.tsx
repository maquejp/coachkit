import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import JSONLD from './JSONLD';
import { ToastContainer } from '@/components/ui/Toast';
import { OfflineBanner } from '@/components/OfflineBanner';
import { CookieConsent } from '@/components/CookieConsent';
import { trackPageView } from '@/lib/analytics';

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <JSONLD />
      <OfflineBanner />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
      <ToastContainer />
    </div>
  );
}
