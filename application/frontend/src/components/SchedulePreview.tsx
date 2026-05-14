import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';

interface ScheduleClass {
  name: string;
  time: string;
  duration: string;
  intensity: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  locationColor?: string;
  locationName?: string;
}

interface SchedulePreviewProps {
  weekDays: { label: string; date: string; classes: ScheduleClass[] }[];
}

const intensityColor = {
  beginner: 'green' as const,
  intermediate: 'warm' as const,
  advanced: 'accent' as const,
};

export default function SchedulePreview({ weekDays }: SchedulePreviewProps) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-3" style={{ minWidth: weekDays.length * 180 }}>
        {weekDays.map((day) => (
          <div
            key={day.label}
            className="min-w-[180px] flex-1 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="mb-3 text-center">
              <p className="text-sm font-semibold text-gray-900">{day.label}</p>
              <p className="text-xs text-gray-500">{day.date}</p>
            </div>
            {day.classes.length === 0 ? (
              <p className="py-6 text-center text-xs text-gray-400">
                {t('schedulePreview.noClasses')}
              </p>
            ) : (
              <div className="space-y-2">
                {day.classes.map((cls, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{cls.name}</span>
                      <Badge color={intensityColor[cls.intensity]}>{cls.intensity}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{cls.time}</span>
                      <span>&middot;</span>
                      <span>{cls.duration}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <span>{cls.instructor}</span>
                      {cls.locationName && (
                        <>
                          <span>·</span>
                          {cls.locationColor && (
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: cls.locationColor }}
                            />
                          )}
                          <span>{cls.locationName}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
