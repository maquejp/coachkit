import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import InstructorCard from '@/components/InstructorCard';
import { coaches, locations } from '@/mocks/fixtures';

const activeLocations = locations.filter((l) => l.isActive);

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('seo.aboutTitle')}
        description={t('seo.aboutDescription')}
        canonical="https://coachkit.app/about"
      />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">{t('aboutPage.heading')}</h1>

        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('aboutPage.ourMission')}</h2>
          <p className="max-w-3xl text-gray-600">{t('aboutPage.missionText')}</p>
        </section>

        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('aboutPage.ourVision')}</h2>
          <p className="max-w-3xl text-gray-600">{t('aboutPage.visionText')}</p>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-gray-900">
            {t('aboutPage.meetOurInstructors')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coaches
              .filter((c) => c.isActive)
              .map((c) => (
                <InstructorCard
                  key={c.id}
                  name={c.name}
                  bio={c.bio}
                  initials={c.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                />
              ))}
          </div>
        </section>

        <section>
          <h2 className="mb-8 text-2xl font-bold text-gray-900">{t('aboutPage.ourLocations')}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {activeLocations.map((l) => (
              <div key={l.id} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{l.name}</h3>
                <p className="text-sm text-gray-600">{l.address}</p>
                <p className="text-sm text-gray-600">{l.city}</p>
                <p className="mt-2 text-sm text-gray-600">{l.phone}</p>
                <p className="text-sm text-gray-600">{l.email}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
