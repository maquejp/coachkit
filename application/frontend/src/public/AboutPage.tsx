import InstructorCard from '@/components/InstructorCard';

const team = [
  {
    name: 'Alex Rivera',
    bio: 'Yoga & Mindfulness — 10+ years guiding students toward inner peace.',
    initials: 'AR',
  },
  {
    name: 'Jordan Chen',
    bio: 'HIIT & Strength Training — Former athlete turned coach.',
    initials: 'JC',
  },
  {
    name: 'Priya Sharma',
    bio: 'Pilates & Flexibility — Certified in multiple movement disciplines.',
    initials: 'PS',
  },
  {
    name: 'Marcus Webb',
    bio: 'Boxing & Cardio — Professional boxer with a passion for teaching.',
    initials: 'MW',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">About Us</h1>
      <p className="mb-2 max-w-2xl text-gray-600">
        CoachKit helps fitness studios streamline operations so they can focus on what matters most
        — their members.
      </p>
      <p className="mb-10 max-w-2xl text-gray-600">
        Our platform powers scheduling, payments, and analytics for studios worldwide.
      </p>
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Meet the Team</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((t) => (
          <InstructorCard key={t.name} {...t} />
        ))}
      </div>
    </div>
  );
}
