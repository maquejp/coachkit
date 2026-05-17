import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'cookie_consent';

type ConsentChoice = 'accepted' | 'declined' | null;

// function getStoredConsent(): ConsentChoice {
//   return localStorage.getItem(CONSENT_KEY) as ConsentChoice;
// }

function setStoredConsent(choice: 'accepted' | 'declined') {
  localStorage.setItem(CONSENT_KEY, choice);
}

export function CookieConsent() {
  const { t } = useTranslation();
  const [consent, setConsent] = useState<ConsentChoice>(null);
  const [visible, setVisible] = useState(false);

  // useEffect(() => {
  //   const stored = getStoredConsent();
  //   if (stored) {
  //     setConsent(stored);
  //   } else {
  //     const timer = setTimeout(() => setVisible(true), 500);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  function handleAccept() {
    setStoredConsent('accepted');
    setConsent('accepted');
    setVisible(false);
  }

  function handleDecline() {
    setStoredConsent('declined');
    setConsent('declined');
    setVisible(false);
  }

  if (consent || !visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-gray-600 sm:text-left">
          {t('cookieConsent.message')}{' '}
          <Link to="/privacy" className="text-primary-600 underline hover:text-primary-700">
            {t('cookieConsent.privacyLink')}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            {t('cookieConsent.decline')}
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            {t('cookieConsent.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
