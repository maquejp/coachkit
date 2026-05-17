import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import ClassCard from '@/components/ClassCard';
import { useClassTypes } from '@/hooks/useClassTypes';
import type { Intensity } from '@/types';

function getIntensity(durationMinutes: number): Intensity {
  if (durationMinutes <= 35) return 'beginner';
  if (durationMinutes <= 50) return 'intermediate';
  return 'advanced';
}

export default function ClassesPage() {
  const { t } = useTranslation();
  const { data: classTypes } = useClassTypes();
  const activeTypes = (classTypes ?? []).filter((ct) => ct.isActive);

  return (
    <>
      <SEO
        title={t('seo.classesTitle')}
        description={t('seo.classesDescription')}
        canonical="https://coachkit.app/classes"
      />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">{t('classesPage.heading')}</h1>
        <p className="mb-10 text-gray-600">{t('classesPage.subtitle')}</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeTypes.map((ct) => (
            <ClassCard
              key={ct.id}
              name={ct.name}
              duration={`${ct.durationMinutes} min`}
              intensity={getIntensity(ct.durationMinutes)}
              description={ct.description}
            />
          ))}
        </div>
      </div>
    </>
  );
}
