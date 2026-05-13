import ClassCard from '@/components/ClassCard';
import type { Intensity } from '@/types';
import { classTypes } from '@/mocks/fixtures';

function getIntensity(durationMinutes: number): Intensity {
  if (durationMinutes <= 35) return 'beginner';
  if (durationMinutes <= 50) return 'intermediate';
  return 'advanced';
}

export default function ClassesPage() {
  const activeTypes = classTypes.filter((ct) => ct.isActive);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">Our Classes</h1>
      <p className="mb-10 text-gray-600">Find the perfect class for your fitness level.</p>
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
  );
}
