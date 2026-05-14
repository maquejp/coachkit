import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { fetchAllLocations, fetchWeeklySchedule, fetchScheduleExceptions } from '@/api/admin';
import type { Location } from '@/api/admin';
import type { WeeklyScheduleItem, ScheduleExceptionItem } from '@/api/admin';
import type { ClassType } from '@/types';

function formatTime(time: string) {
  const [h, m] = time.split(':');
  const hour = Number(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function LocationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [schedules, setSchedules] = useState<WeeklyScheduleItem[]>([]);
  const [exceptions, setExceptions] = useState<ScheduleExceptionItem[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [locs, sched, exc] = await Promise.all([
          fetchAllLocations(),
          fetchWeeklySchedule(),
          fetchScheduleExceptions(id),
        ]);
        if (cancelled) return;
        const loc = locs.find((l) => l.id === id) ?? null;
        setLocation(loc);
        setSchedules(sched.filter((s) => s.locationId === id));
        setExceptions(exc);
      } catch {
        // non-fatal
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const mod = await import('@/api/admin');
        const cts = await mod.fetchAllClassTypes();
        if (!cancelled) setClassTypes(cts);
      } catch {
        // non-fatal
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <Spinner centered size="lg" />;

  if (!location) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Location not found.</p>
        <Link
          to="/admin/locations"
          className="mt-2 inline-block text-sm text-primary-600 hover:underline"
        >
          &larr; Back to Locations
        </Link>
      </div>
    );
  }

  const groupedSchedules = DAY_NAMES.map((name, idx) => ({
    day: name,
    dayNum: idx + 1,
    slots: schedules.filter((s) => s.dayOfWeek === idx + 1),
  }));

  return (
    <>
      <SEO title={location.name} description={`Manage ${location.name}.`} />

      <div className="mb-6">
        <Link to="/admin/locations" className="text-sm text-primary-600 hover:underline">
          &larr; Back to Locations
        </Link>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{location.name}</h1>
          <p className="mt-1 text-gray-500">
            {location.address}, {location.city}
          </p>
        </div>
        <Badge color={location.isActive ? 'green' : 'gray'}>
          {location.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Contact</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-700">Phone:</span> {location.phone}
            </p>
            <p>
              <span className="font-medium text-gray-700">Email:</span> {location.email}
            </p>
            {location.mapLink && (
              <p>
                <a
                  href={location.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  Open in Maps &rarr;
                </a>
              </p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Summary</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-700">Weekly Slots:</span> {schedules.length}
            </p>
            <p>
              <span className="font-medium text-gray-700">Exceptions:</span> {exceptions.length}
            </p>
          </div>
        </Card>
      </div>

      <Card className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Weekly Schedule</h2>
        {schedules.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            No schedule slots for this location.
          </div>
        ) : (
          <div className="space-y-4">
            {groupedSchedules.map(
              (g) =>
                g.slots.length > 0 && (
                  <div key={g.day}>
                    <h3 className="mb-1 text-sm font-medium text-gray-700">{g.day}</h3>
                    <div className="space-y-1">
                      {g.slots.map((slot) => {
                        const ct = classTypes.find((c) => c.id === slot.classTypeId);
                        return (
                          <div
                            key={slot.id}
                            className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 text-sm"
                          >
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: ct?.color ?? '#ccc' }}
                            />
                            <span className="font-medium text-gray-900">
                              {ct?.name ?? 'Unknown'}
                            </span>
                            <span className="text-gray-500">
                              {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
                            </span>
                            <span className="ml-auto text-xs text-gray-400">
                              Cap: {slot.maxCapacity}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ),
            )}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Schedule Exceptions</h2>
        {exceptions.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            No exceptions for this location.
          </div>
        ) : (
          <div className="space-y-2">
            {exceptions.map((ex) => (
              <div
                key={ex.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-medium text-gray-900">{ex.date}</span>
                  <span className="ml-2 text-gray-500">{ex.reason}</span>
                </div>
                <Badge color={ex.isClosed ? 'accent' : 'warm'}>
                  {ex.isClosed ? 'Closed' : 'Modified Hours'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
