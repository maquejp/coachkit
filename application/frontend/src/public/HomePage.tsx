import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import PricingCard from '@/components/PricingCard';
import GoogleReviewsCarousel from '@/components/GoogleReviewsCarousel';
import SchedulePreview from '@/components/SchedulePreview';
import GalleryGrid from '@/components/GalleryGrid';
import InstructorCard from '@/components/InstructorCard';

const features = [
  {
    icon: '\u2606',
    title: 'Smart Scheduling',
    description: 'Book classes, manage slots, and handle waitlists effortlessly.',
  },
  {
    icon: '\u2665',
    title: 'Member Management',
    description: 'Track attendance, subscriptions, and session usage in one place.',
  },
  {
    icon: '\u2609',
    title: 'Analytics Dashboard',
    description: 'Real-time insights into bookings, revenue, and retention.',
  },
];

const reviews = [
  {
    quote: 'CoachKit transformed how we manage our studio. Our members love the ease of booking.',
    author: 'Sarah M.',
    rating: 5,
    initials: 'SM',
  },
  {
    quote: 'The scheduling features are incredible. Saves us hours every week.',
    author: 'James L.',
    rating: 5,
    initials: 'JL',
  },
  {
    quote: 'Beautiful interface and the support team is always responsive.',
    author: 'Elena R.',
    rating: 4,
    initials: 'ER',
  },
];

const instructors = [
  { name: 'Alex Rivera', bio: 'Yoga & Mindfulness', initials: 'AR' },
  { name: 'Jordan Chen', bio: 'HIIT & Strength Training', initials: 'JC' },
  { name: 'Priya Sharma', bio: 'Pilates & Flexibility', initials: 'PS' },
];

const weekDays = [
  {
    label: 'Mon',
    date: 'May 11',
    classes: [
      {
        name: 'Morning Yoga',
        time: '7:00 AM',
        duration: '60 min',
        intensity: 'beginner' as const,
        instructor: 'Alex R.',
      },
      {
        name: 'HIIT Circuit',
        time: '9:00 AM',
        duration: '45 min',
        intensity: 'advanced' as const,
        instructor: 'Jordan C.',
      },
    ],
  },
  {
    label: 'Tue',
    date: 'May 12',
    classes: [
      {
        name: 'Pilates Flow',
        time: '8:00 AM',
        duration: '50 min',
        intensity: 'intermediate' as const,
        instructor: 'Priya S.',
      },
    ],
  },
  {
    label: 'Wed',
    date: 'May 13',
    classes: [
      {
        name: 'Morning Yoga',
        time: '7:00 AM',
        duration: '60 min',
        intensity: 'beginner' as const,
        instructor: 'Alex R.',
      },
      {
        name: 'Strength & Tone',
        time: '10:00 AM',
        duration: '45 min',
        intensity: 'intermediate' as const,
        instructor: 'Jordan C.',
      },
    ],
  },
  {
    label: 'Thu',
    date: 'May 14',
    classes: [
      {
        name: 'Pilates Flow',
        time: '8:00 AM',
        duration: '50 min',
        intensity: 'intermediate' as const,
        instructor: 'Priya S.',
      },
      {
        name: 'HIIT Circuit',
        time: '5:30 PM',
        duration: '45 min',
        intensity: 'advanced' as const,
        instructor: 'Jordan C.',
      },
    ],
  },
  {
    label: 'Fri',
    date: 'May 15',
    classes: [
      {
        name: 'Morning Yoga',
        time: '7:00 AM',
        duration: '60 min',
        intensity: 'beginner' as const,
        instructor: 'Alex R.',
      },
    ],
  },
];

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop',
    alt: 'Yoga studio',
  },
  {
    src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    alt: 'Gym equipment',
  },
  {
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
    alt: 'Fitness class',
  },
  {
    src: 'https://images.unsplash.com/photo-1574680099147-dc0a824f3c60?w=400&h=300&fit=crop',
    alt: 'Personal training',
  },
  {
    src: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop',
    alt: 'Meditation session',
  },
  {
    src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop',
    alt: 'Boxing class',
  },
];

const pricingPlans = [
  {
    planName: 'Drop-In',
    price: '$20',
    period: '/session',
    features: ['Single class access', 'No commitment', 'Valid for 30 days'],
    ctaLabel: 'Book Now',
  },
  {
    planName: 'Monthly',
    price: '$99',
    period: '/month',
    features: ['Unlimited classes', 'Priority booking', 'Free guest pass'],
    featured: true,
    ctaLabel: 'Start Free Trial',
  },
  {
    planName: 'Annual',
    price: '$899',
    period: '/year',
    features: ['Everything in Monthly', '2 months free', 'Exclusive workshops'],
    ctaLabel: 'Get Annual',
  },
];

export default function HomePage() {
  return (
    <>
      <HeroSection
        title="Your Studio, Simplified."
        subtitle="Smart scheduling, member management, and analytics for fitness studios and wellness businesses."
        ctaLabel="Start Free Trial"
        secondaryCtaLabel="View Classes"
      />

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">Why CoachKit?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
            Meet Our Instructors
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {instructors.map((i) => (
              <InstructorCard key={i.name} {...i} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">This Week's Schedule</h2>
        <SchedulePreview weekDays={weekDays} />
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">Pricing</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((p) => (
              <PricingCard key={p.planName} {...p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">What Our Members Say</h2>
        <div className="mx-auto max-w-xl">
          <GoogleReviewsCarousel reviews={reviews} />
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">Gallery</h2>
          <GalleryGrid images={galleryImages} />
        </div>
      </section>
    </>
  );
}
