import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import InstructorCard from '@/components/InstructorCard';
import { useCoaches } from '@/hooks/useCoaches';
import { useLocations } from '@/hooks/useLocations';

export default function AboutPage() {
  const { t } = useTranslation();
  const { data: coaches } = useCoaches();
  const { data: locations } = useLocations();
  const activeCoaches = (coaches ?? []).filter((c) => c.isActive);
  const activeLocations = (locations ?? []).filter((l) => l.isActive);

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
            {activeCoaches.map((c) => (
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeLocations.map((loc) => (
              <div key={loc.id} className="rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900">{loc.name}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {loc.address}, {loc.city}
                </p>
                {loc.phone && <p className="mt-1 text-sm text-gray-500">{loc.phone}</p>}
                {loc.email && <p className="text-sm text-gray-500">{loc.email}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
