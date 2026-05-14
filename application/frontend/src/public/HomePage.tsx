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
import { coaches, classTypes, reviews, subscriptionPlans, weeklySchedule } from '@/mocks/fixtures';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      classes: weeklySchedule
        .filter((s) => s.dayOfWeek === 1)
        .map((s) => ({
          name: classTypes.find((c) => c.id === s.classTypeId)?.name ?? '',
          time: s.startTime,
          duration: `${Math.round((new Date(`2000-01-01T${s.endTime}`).getTime() - new Date(`2000-01-01T${s.startTime}`).getTime()) / 60000)} min`,
          intensity: 'intermediate' as const,
          instructor: coaches.find((c) => c.id === s.coachId)?.name.split(' ')[0] ?? '',
        })),
    },
    {
      label: t('homePage.scheduleDays.tue'),
      date: 'May 12',
      classes: weeklySchedule
        .filter((s) => s.dayOfWeek === 2)
        .map((s) => ({
          name: classTypes.find((c) => c.id === s.classTypeId)?.name ?? '',
          time: s.startTime,
          duration: `${Math.round((new Date(`2000-01-01T${s.endTime}`).getTime() - new Date(`2000-01-01T${s.startTime}`).getTime()) / 60000)} min`,
          intensity: 'intermediate' as const,
          instructor: coaches.find((c) => c.id === s.coachId)?.name.split(' ')[0] ?? '',
        })),
    },
    {
      label: t('homePage.scheduleDays.wed'),
      date: 'May 13',
      classes: weeklySchedule
        .filter((s) => s.dayOfWeek === 3)
        .map((s) => ({
          name: classTypes.find((c) => c.id === s.classTypeId)?.name ?? '',
          time: s.startTime,
          duration: `${Math.round((new Date(`2000-01-01T${s.endTime}`).getTime() - new Date(`2000-01-01T${s.startTime}`).getTime()) / 60000)} min`,
          intensity: 'intermediate' as const,
          instructor: coaches.find((c) => c.id === s.coachId)?.name.split(' ')[0] ?? '',
        })),
    },
    {
      label: t('homePage.scheduleDays.thu'),
      date: 'May 14',
      classes: weeklySchedule
        .filter((s) => s.dayOfWeek === 4)
        .map((s) => ({
          name: classTypes.find((c) => c.id === s.classTypeId)?.name ?? '',
          time: s.startTime,
          duration: `${Math.round((new Date(`2000-01-01T${s.endTime}`).getTime() - new Date(`2000-01-01T${s.startTime}`).getTime()) / 60000)} min`,
          intensity: 'intermediate' as const,
          instructor: coaches.find((c) => c.id === s.coachId)?.name.split(' ')[0] ?? '',
        })),
    },
    {
      label: t('homePage.scheduleDays.fri'),
      date: 'May 15',
      classes: weeklySchedule
        .filter((s) => s.dayOfWeek === 5)
        .map((s) => ({
          name: classTypes.find((c) => c.id === s.classTypeId)?.name ?? '',
          time: s.startTime,
          duration: `${Math.round((new Date(`2000-01-01T${s.endTime}`).getTime() - new Date(`2000-01-01T${s.startTime}`).getTime()) / 60000)} min`,
          intensity: 'intermediate' as const,
          instructor: coaches.find((c) => c.id === s.coachId)?.name.split(' ')[0] ?? '',
        })),
    },
    {
      label: t('homePage.scheduleDays.sat'),
      date: 'May 16',
      classes: weeklySchedule
        .filter((s) => s.dayOfWeek === 6)
        .map((s) => ({
          name: classTypes.find((c) => c.id === s.classTypeId)?.name ?? '',
          time: s.startTime,
          duration: `${Math.round((new Date(`2000-01-01T${s.endTime}`).getTime() - new Date(`2000-01-01T${s.startTime}`).getTime()) / 60000)} min`,
          intensity: 'intermediate' as const,
          instructor: coaches.find((c) => c.id === s.coachId)?.name.split(' ')[0] ?? '',
        })),
    },
  ];

  const activeTypes = classTypes.filter((ct) => ct.isActive);
  const pricingPlans = subscriptionPlans
    .filter((sp) => sp.isActive)
    .map((p) => ({
      planName: p.name,
      price: `$${(p.priceCents / 100).toFixed(0)}`,
      period: p.interval === 'monthly' ? t('pricingPage.perMonth') : t('pricingPage.perYear'),
      features: p.features,
      featured: p.name === 'Monthly Unlimited',
      ctaLabel: p.trialDays > 0 ? t('pricingPage.startFreeTrial') : t('common.getStarted'),
    }));

  const galleryImages = [
    { src: '/images/yoga-studio.jpg', alt: t('homePage.galleryAlt.yoga') },
    { src: '/images/gym-equipment.jpg', alt: t('homePage.galleryAlt.gym') },
    { src: '/images/fitness-class.jpg', alt: t('homePage.galleryAlt.fitness') },
    { src: '/images/personal-training.jpg', alt: t('homePage.galleryAlt.training') },
    { src: '/images/meditation.jpg', alt: t('homePage.galleryAlt.meditation') },
    { src: '/images/boxing.jpg', alt: t('homePage.galleryAlt.boxing') },
  ];

  return (
    <>
      <SEO
        title={t('seo.homeTitle')}
        description={t('seo.homeDescription')}
        canonical="https://coachkit.app/"
      />
      <HeroSection
        title={t('heroSection.title')}
        subtitle={t('heroSection.subtitle')}
        ctaLabel={t('heroSection.ctaLabel')}
        onCtaClick={() => navigate('/book')}
        secondaryCtaLabel={t('heroSection.secondaryCtaLabel')}
        onSecondaryCtaClick={() => navigate('/classes')}
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          {t('homePage.whyCoachKit')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
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
                  ct.durationMinutes >= 50 ? ('intermediate' as const) : ('beginner' as const)
                }
                description={ct.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          {t('homePage.meetOurInstructors')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
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

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {t('homePage.thisWeekSchedule')}
          </h2>
          <SchedulePreview weekDays={scheduleDays} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          {t('homePage.pricingSection')}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((p) => (
            <PricingCard key={p.planName} {...p} onCta={() => navigate('/pricing')} />
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            {t('homePage.whatOurMembersSay')}
          </h2>
          <div className="mx-auto max-w-xl">
            <GoogleReviewsCarousel reviews={reviews} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
          {t('homePage.gallery')}
        </h2>
        <GalleryGrid images={galleryImages} />
      </section>

      <section className="bg-primary-900 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold">{t('homePage.followUsHeading')}</h2>
          <p className="mt-2 text-primary-200">{t('homePage.followUsText')}</p>
          <div className="mt-6 flex justify-center gap-4">
            {[
              {
                href: '#',
                label: 'facebook',
                path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z',
              },
              {
                href: '#',
                label: 'instagram',
                path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
              },
              {
                href: '#',
                label: 'twitter',
                path: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                aria-label={t(`common.${s.label}`)}
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
