import ClassCard from '@/components/ClassCard';

const classes = [
  {
    name: 'Morning Yoga',
    duration: '60 min',
    intensity: 'beginner' as const,
    description: 'Start your day with gentle stretches and mindfulness.',
  },
  {
    name: 'HIIT Circuit',
    duration: '45 min',
    intensity: 'advanced' as const,
    description: 'High-intensity interval training for maximum results.',
  },
  {
    name: 'Pilates Flow',
    duration: '50 min',
    intensity: 'intermediate' as const,
    description: 'Core-strengthening Pilates with controlled movements.',
  },
  {
    name: 'Strength & Tone',
    duration: '45 min',
    intensity: 'intermediate' as const,
    description: 'Build lean muscle with resistance training.',
  },
  {
    name: 'Boxing Fitness',
    duration: '50 min',
    intensity: 'advanced' as const,
    description: 'Cardio boxing combining technique and endurance.',
  },
  {
    name: 'Meditation',
    duration: '30 min',
    intensity: 'beginner' as const,
    description: 'Guided meditation for relaxation and focus.',
  },
];

export default function ClassesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">Our Classes</h1>
      <p className="mb-10 text-gray-600">Find the perfect class for your fitness level.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => (
          <ClassCard key={c.name} {...c} />
        ))}
      </div>
    </div>
  );
}
