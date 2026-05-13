import InstructorCard from '@/components/InstructorCard';
import { coaches, locations } from '@/mocks/fixtures';

const activeLocations = locations.filter((l) => l.isActive);

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="mb-2 text-4xl font-bold text-gray-900">About Us</h1>

      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Our Mission</h2>
        <p className="max-w-3xl text-gray-600">
          CoachKit empowers fitness studios and wellness businesses with the tools they need to
          streamline operations, delight members, and grow their community. Our platform handles
          scheduling, payments, attendance, and analytics so you can focus on what matters most
          &mdash; your members.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Our Vision</h2>
        <p className="max-w-3xl text-gray-600">
          We believe everyone deserves access to transformative wellness experiences. By making
          studio management effortless, we help fitness professionals spend less time on paperwork
          and more time changing lives.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Meet Our Instructors</h2>
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
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Our Locations</h2>
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
  );
}
