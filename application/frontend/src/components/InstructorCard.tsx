import { Avatar } from '@/components/ui/Avatar';

interface InstructorCardProps {
  name: string;
  bio: string;
  photoSrc?: string;
  initials?: string;
  className?: string;
}

export default function InstructorCard({
  name,
  bio,
  photoSrc,
  initials,
  className = '',
}: InstructorCardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 text-center transition-shadow hover:shadow-card-hover ${className}`}
    >
      <Avatar src={photoSrc} initials={initials} size="xl" className="mx-auto" />
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{name}</h3>
      <p className="mt-1 text-sm text-gray-500">{bio}</p>
    </div>
  );
}
