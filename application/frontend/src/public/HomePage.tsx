import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import PricingCard from '@/components/PricingCard';
import ClassCard from '@/components/ClassCard';
import GoogleReviewsCarousel from '@/components/GoogleReviewsCarousel';
import SchedulePreview from '@/components/SchedulePreview';
import GalleryGrid from '@/components/GalleryGrid';
import InstructorCard from '@/components/InstructorCard';
import { useCoaches } from '@/hooks/useCoaches';
import { useClassTypes } from '@/hooks/useClassTypes';
import { useLocations } from '@/hooks/useLocations';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { useWeeklySchedule } from '@/hooks/useWeeklySchedule';
import { formatCurrency } from '@/lib/format';

const reviews = [
  { id: '1', name: 'Sarah M.', text: 'homePage.review1', rating: 5, avatar: null },
  { id: '2', name: 'James K.', text: 'homePage.review2', rating: 5, avatar: null },
  { id: '3', name: 'Emma L.', text: 'homePage.review3', rating: 5, avatar: null },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: coaches } = useCoaches();
  const { data: classTypes } = useClassTypes();
  const { data: locations } = useLocations();
  const { data: subPlans } = useSubscriptionPlans();
  const { data: weeklySchedule } = useWeeklySchedule();

  const activeCoaches = (coaches ?? []).filter((c) => c.isActive);
  const activeTypes = (classTypes ?? []).filter((ct) => ct.isActive);
  const activeLocations = (locations ?? []).filter((l) => l.isActive);
  const activePlans = (subPlans ?? []).filter((sp) => sp.isActive);
  const schedule = weeklySchedule ?? [];

  const features = [
    {
      icon: '\u2606',
      title: t('homePage.features.smartScheduling.title'),
      description: t('homePage.features.smartScheduling.description'),
    },
    {
      icon: '\u2665',
      title: t('homePage.features.memberManagement.title'),
      description: t('homePage.features.memberManagement.description'),
    },
    {
      icon: '\u2609',
      title: t('homePage.features.analyticsDashboard.title'),
      description: t('homePage.features.analyticsDashboard.description'),
    },
  ];

  const scheduleDays = [
    {
      label: t('homePage.scheduleDays.mon'),
      date: 'May 11',
      classes: schedule
        .filter((s) => s.dayOfWeek === 1)
        .map((s) => {
          const ct = activeTypes.find((c) => c.id === s.classTypeId);
          const loc = activeLocations.find((l) => l.id === s.locationId);
          return {
            name: ct?.name ?? 'Class',
            time: s.startTime,
            coach: '',
            location: loc?.name ?? '',
          };
        }),
    },
    {
      label: t('homePage.scheduleDays.tue'),
      date: 'May 12',
      classes: schedule
        .filter((s) => s.dayOfWeek === 2)
        .map((s) => {
          const ct = activeTypes.find((c) => c.id === s.classTypeId);
          const loc = activeLocations.find((l) => l.id === s.locationId);
          return {
            name: ct?.name ?? 'Class',
            time: s.startTime,
            coach: '',
            location: loc?.name ?? '',
          };
        }),
    },
    {
      label: t('homePage.scheduleDays.wed'),
      date: 'May 13',
      classes: schedule
        .filter((s) => s.dayOfWeek === 3)
        .map((s) => {
          const ct = activeTypes.find((c) => c.id === s.classTypeId);
          const loc = activeLocations.find((l) => l.id === s.locationId);
          return {
            name: ct?.name ?? 'Class',
            time: s.startTime,
            coach: '',
            location: loc?.name ?? '',
          };
        }),
    },
  ];

  const instructorData = activeCoaches.map((c) => ({
    name: c.name,
    bio: c.bio,
    initials: c.name
      .split(' ')
      .map((n) => n[0])
      .join(''),
  }));

  return (
    <>
      <SEO
        title={t('seo.homeTitle')}
        description={t('seo.homeDescription')}
        canonical="https://coachkit.app"
      />
      <HeroSection
        title={t('heroSection.title')}
        subtitle={t('heroSection.subtitle')}
        ctaLabel={t('heroSection.ctaLabel')}
        onCtaClick={() => navigate('/pricing')}
      />
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {t('homePage.whyCoachKit')}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <FeatureCard key={i} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {t('homePage.ourClasses')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeTypes.slice(0, 6).map((ct) => (
              <ClassCard
                key={ct.id}
                name={ct.name}
                duration={`${ct.durationMinutes} min`}
                intensity={
                  ct.durationMinutes <= 35
                    ? ('beginner' as const)
                    : ct.durationMinutes <= 50
                      ? ('intermediate' as const)
                      : ('advanced' as const)
                }
                description={ct.description}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {t('homePage.thisWeekSchedule')}
          </h2>
          <SchedulePreview weekDays={scheduleDays} />
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {t('homePage.pricingSection')}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {activePlans.slice(0, 3).map((p, i) => (
              <PricingCard
                key={i}
                planName={p.name}
                price={formatCurrency(p.priceCents, 'EUR', false)}
                period={
                  p.interval === 'monthly' ? t('pricingPage.perMonth') : t('pricingPage.perYear')
                }
                features={p.features}
                featured={p.name === 'Monthly Unlimited'}
                ctaLabel={
                  p.trialDays > 0 ? t('pricingPage.startFreeTrial') : t('common.getStarted')
                }
              />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {t('homePage.meetOurInstructors')}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {instructorData.slice(0, 4).map((c, i) => (
              <InstructorCard key={i} name={c.name} bio={c.bio} initials={c.initials} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {t('homePage.whatOurMembersSay')}
          </h2>
          <GoogleReviewsCarousel reviews={reviews.map((r) => ({ ...r, text: t(r.text) }))} />
        </div>
      </section>
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {t('homePage.gallery')}
          </h2>
          <GalleryGrid images={[]} />
        </div>
      </section>
    </>
  );
}
