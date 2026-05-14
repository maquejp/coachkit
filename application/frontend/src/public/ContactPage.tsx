import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import ContactForm from '@/components/ContactForm';
import { locations } from '@/mocks/fixtures';
import { trackEvent } from '@/lib/analytics';

const activeLocations = locations.filter((l) => l.isActive);

export default function ContactPage() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(data: { name: string; email: string; phone: string; message: string }) {
    trackEvent('contact_form_submitted', { email: data.email });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <>
        <SEO
          title={t('seo.contactSuccessTitle')}
          description={t('seo.contactSuccessDescription')}
        />
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
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
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">{t('contactPage.thankYou')}</h1>
          <p className="text-gray-600">{t('contactPage.successMessage')}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={t('seo.contactTitle')}
        description={t('seo.contactDescription')}
        canonical="https://coachkit.app/contact"
      />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">{t('contactPage.heading')}</h1>
        <p className="mb-10 text-gray-600">{t('contactPage.subtitle')}</p>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900">{t('contactPage.sendMessage')}</h2>
            <ContactForm onSubmit={handleSubmit} />
          </div>
          <div>
            <h2 className="mb-6 text-xl font-bold text-gray-900">{t('contactPage.visitUs')}</h2>
            <div className="space-y-6">
              {activeLocations.map((l) => (
                <div key={l.id} className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{l.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{l.address}</p>
                    <p>{l.city}</p>
                    <p>{l.phone}</p>
                    <p>{l.email}</p>
                  </div>
                  {l.mapLink && (
                    <a
                      href={l.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {t('contactPage.viewOnMap')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
