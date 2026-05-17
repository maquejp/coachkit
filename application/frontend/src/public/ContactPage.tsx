import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import ContactForm from '@/components/ContactForm';
import { useLocations } from '@/hooks/useLocations';

export default function ContactPage() {
  const { t } = useTranslation();
  const { data: locations } = useLocations();
  const activeLocations = (locations ?? []).filter((l) => l.isActive);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
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
      <SEO title={t('seo.contactTitle')} description={t('seo.contactDescription')} />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">{t('contactPage.heading')}</h1>
        <p className="mb-10 text-gray-600">{t('contactPage.subtitle')}</p>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <ContactForm onSuccess={handleSubmit} />
          </div>
          <div className="space-y-6">
            {activeLocations.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  {t('contactPage.visitUs')}
                </h2>
                {activeLocations.map((loc) => (
                  <div key={loc.id} className="mb-4">
                    <p className="font-medium text-gray-900">{loc.name}</p>
                    <p className="text-sm text-gray-600">
                      {loc.address}, {loc.city}
                    </p>
                    {loc.phone && <p className="text-sm text-gray-600">{loc.phone}</p>}
                    {loc.email && <p className="text-sm text-gray-600">{loc.email}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
