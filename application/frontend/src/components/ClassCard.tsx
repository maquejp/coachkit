import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ClassCardProps {
  imageSrc?: string;
  name: string;
  duration: string;
  intensity: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
  onBook?: () => void;
}

const intensityColor = {
  beginner: 'green' as const,
  intermediate: 'warm' as const,
  advanced: 'accent' as const,
};

export default function ClassCard({
  imageSrc,
  name,
  duration,
  intensity,
  description,
  onBook,
}: ClassCardProps) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-card-hover">
      {imageSrc ? (
        <img src={imageSrc} alt={name} className="h-40 w-full object-cover" />
      ) : (
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
          <span className="text-3xl font-bold text-primary-400">{name.charAt(0)}</span>
        </div>
      )}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <Badge color={intensityColor[intensity]}>{intensity}</Badge>
        </div>
        <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {duration}
        </div>
        {description && <p className="mb-4 text-sm text-gray-600">{description}</p>}
        {onBook && (
          <Button size="sm" className="w-full" onClick={onBook}>
            {t('classCard.bookNow')}
          </Button>
        )}
      </div>
    </div>
  );
}
