import { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import {
  fetchWeeklySchedule,
  createWeeklySchedule,
  updateWeeklySchedule,
  deleteWeeklySchedule,
  fetchScheduleExceptions,
  createScheduleException,
  deleteScheduleException,
  fetchAllClassTypes,
  fetchAllCoaches,
  fetchAllLocations,
} from '@/api/admin';
import type { WeeklyScheduleItem, ScheduleExceptionItem } from '@/api/admin';
import type { ClassType, Coach, Location } from '@/types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatTime(time: string) {
  const [h, m] = time.split(':');
  const hour = Number(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

const HOURS = Array.from({ length: 16 }, (_, i) => {
  const h = i + 6;
  return `${String(h).padStart(2, '0')}:00`;
});

interface SlotForm {
  dayOfWeek: number;
  classTypeId: string;
  coachId: string;
  locationId: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
}

const emptySlotForm: SlotForm = {
  dayOfWeek: 1,
  classTypeId: '',
  coachId: '',
  locationId: '',
  startTime: '07:00',
  endTime: '08:00',
  maxCapacity: 20,
};

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<WeeklyScheduleItem[]>([]);
  const [exceptions, setExceptions] = useState<ScheduleExceptionItem[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLocId, setFilterLocId] = useState('');

  const [editingSlot, setEditingSlot] = useState<WeeklyScheduleItem | null>(null);
  const [creatingSlot, setCreatingSlot] = useState<SlotForm | null>(null);
  const [deletingSlot, setDeletingSlot] = useState<WeeklyScheduleItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [creatingException, setCreatingException] = useState(false);
  const [exDate, setExDate] = useState('');
  const [exLocationId, setExLocationId] = useState('');
  const [exIsClosed, setExIsClosed] = useState(true);
  const [exOpenTime, setExOpenTime] = useState('08:00');
  const [exCloseTime, setExCloseTime] = useState('14:00');
  const [exReason, setExReason] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [sched, exc, cts, cos, locs] = await Promise.all([
          fetchWeeklySchedule(),
          fetchScheduleExceptions(),
          fetchAllClassTypes(),
          fetchAllCoaches(),
          fetchAllLocations(),
        ]);
        if (cancelled) return;
        setSchedules(sched);
        setExceptions(exc);
        setClassTypes(cts);
        setCoaches(cos);
        setLocations(locs);
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
  }, []);

  const activeLocations = locations.filter((l) => l.isActive);

  const filteredSchedules = filterLocId
    ? schedules.filter((s) => s.locationId === filterLocId)
    : schedules;

  const filteredExceptions = filterLocId
    ? exceptions.filter((e) => e.locationId === filterLocId)
    : exceptions;

  function getSlotForm(slot: WeeklyScheduleItem): SlotForm {
    return {
      dayOfWeek: slot.dayOfWeek,
      classTypeId: slot.classTypeId,
      coachId: slot.coachId,
      locationId: slot.locationId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxCapacity: slot.maxCapacity,
    };
  }

  function getSlotsForCell(day: number, hour: string) {
    const hourStart = timeToMinutes(hour);
    const hourEnd = hourStart + 60;
    return filteredSchedules.filter(
      (s) =>
        s.dayOfWeek === day + 1 &&
        timeToMinutes(s.startTime) < hourEnd &&
        timeToMinutes(s.endTime) > hourStart,
    );
  }

  async function handleCreateSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!creatingSlot) return;
    setSaving(true);
    try {
      const created = await createWeeklySchedule({
        dayOfWeek: creatingSlot.dayOfWeek,
        classTypeId: creatingSlot.classTypeId,
        coachId: creatingSlot.coachId,
        locationId: creatingSlot.locationId || filterLocId || activeLocations[0]?.id || '',
        startTime: creatingSlot.startTime,
        endTime: creatingSlot.endTime,
        maxCapacity: creatingSlot.maxCapacity,
        isActive: true,
      });
      setSchedules((prev) => [...prev, created]);
      setCreatingSlot(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateSlot(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSlot) return;
    setSaving(true);
    try {
      const updated = await updateWeeklySchedule(editingSlot.id, getSlotForm(editingSlot));
      setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setEditingSlot(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSlot() {
    if (!deletingSlot) return;
    setSaving(true);
    try {
      await deleteWeeklySchedule(deletingSlot.id);
      setSchedules((prev) => prev.filter((s) => s.id !== deletingSlot.id));
      setDeletingSlot(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateException(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createScheduleException({
        date: exDate,
        locationId: exLocationId || filterLocId || activeLocations[0]?.id || '',
        isClosed: exIsClosed,
        openTime: exIsClosed ? null : exOpenTime,
        closeTime: exIsClosed ? null : exCloseTime,
        reason: exReason,
      });
      setExceptions((prev) => [...prev, created]);
      setCreatingException(false);
      setExDate('');
      setExReason('');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteException(id: string) {
    try {
      await deleteScheduleException(id);
      setExceptions((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // non-fatal
    }
  }

  if (loading) return <Spinner centered size="lg" />;

  return (
    <>
      <SEO title="Schedule Management" description="Manage weekly class schedule." />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="mt-1 text-gray-500">Manage weekly class timetable and exceptions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={filterLocId}
            onChange={(e) => setFilterLocId(e.target.value)}
            className="w-48"
          >
            <option value="">All Locations</option>
            {activeLocations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <Card className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 bg-gray-50">
            <div className="p-2 text-xs font-medium text-gray-500">Time</div>
            {DAYS.map((d) => (
              <div key={d} className="p-2 text-center text-xs font-medium text-gray-500">
                {d}
              </div>
            ))}
          </div>
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-100"
            >
              <div className="flex items-center justify-center p-1 text-xs text-gray-400">
                {formatTime(hour)}
              </div>
              {DAYS.map((_, dayIdx) => {
                const slots = getSlotsForCell(dayIdx, hour);
                return (
                  <div key={dayIdx} className="min-h-[52px] border-l border-gray-100 p-0.5">
                    {slots.length === 0 ? (
                      <button
                        onClick={() =>
                          setCreatingSlot({
                            ...emptySlotForm,
                            dayOfWeek: dayIdx + 1,
                            startTime: hour,
                            endTime: HOURS[HOURS.indexOf(hour) + 1]
                              ? `${String(Number(hour.split(':')[0]) + 1).padStart(2, '0')}:00`
                              : '21:00',
                          })
                        }
                        className="flex h-full w-full items-center justify-center rounded text-xs text-gray-300 opacity-0 transition-opacity hover:bg-primary-50 hover:text-primary-400 hover:opacity-100"
                      >
                        + Add
                      </button>
                    ) : (
                      <div className="space-y-0.5">
                        {slots.map((slot) => {
                          const ct = classTypes.find((c) => c.id === slot.classTypeId);
                          return (
                            <button
                              key={slot.id}
                              onClick={() => setEditingSlot(slot)}
                              className="w-full rounded bg-primary-100 px-1 py-0.5 text-left text-xs text-primary-800 transition-colors hover:bg-primary-200"
                            >
                              <span className="font-medium">{ct?.name ?? 'Class'}</span>
                              <span className="ml-1 text-primary-600">
                                {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Schedule Exceptions</h2>
            <p className="text-sm text-gray-500">Holidays, closures, and modified hours.</p>
          </div>
          <Button onClick={() => setCreatingException(true)}>Add Exception</Button>
        </div>
        {filteredExceptions.length === 0 ? (
          <Card>
            <div className="py-8 text-center text-sm text-gray-400">No exceptions set.</div>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredExceptions.map((ex) => {
              const loc = locations.find((l) => l.id === ex.locationId);
              return (
                <Card key={ex.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {ex.date} — {ex.reason}
                      </p>
                      <p className="text-xs text-gray-500">
                        {loc ? loc.name : 'Unknown location'}
                        {ex.isClosed
                          ? ' · Closed'
                          : ` · ${formatTime(ex.openTime ?? '')}–${formatTime(ex.closeTime ?? '')}`}
                      </p>
                    </div>
                    <Badge color={ex.isClosed ? 'accent' : 'warm'}>
                      {ex.isClosed ? 'Closed' : 'Modified'}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteException(ex.id)}>
                      Remove
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={!!creatingSlot}
        onClose={() => setCreatingSlot(null)}
        title="Create Schedule Slot"
        size="md"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <FormField label="Class Type" required>
            <Select
              value={creatingSlot?.classTypeId ?? ''}
              onChange={(e) =>
                setCreatingSlot((prev) => (prev ? { ...prev, classTypeId: e.target.value } : null))
              }
              required
            >
              <option value="">Select class</option>
              {classTypes
                .filter((c) => c.isActive)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </Select>
          </FormField>
          <FormField label="Coach" required>
            <Select
              value={creatingSlot?.coachId ?? ''}
              onChange={(e) =>
                setCreatingSlot((prev) => (prev ? { ...prev, coachId: e.target.value } : null))
              }
              required
            >
              <option value="">Select coach</option>
              {coaches
                .filter((c) => c.isActive)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </Select>
          </FormField>
          <FormField label="Location" required>
            <Select
              value={creatingSlot?.locationId || filterLocId || ''}
              onChange={(e) =>
                setCreatingSlot((prev) => (prev ? { ...prev, locationId: e.target.value } : null))
              }
              required
            >
              <option value="">Select location</option>
              {activeLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Time" required>
              <Input
                type="time"
                value={creatingSlot?.startTime ?? '07:00'}
                onChange={(e) =>
                  setCreatingSlot((prev) => (prev ? { ...prev, startTime: e.target.value } : null))
                }
                required
              />
            </FormField>
            <FormField label="End Time" required>
              <Input
                type="time"
                value={creatingSlot?.endTime ?? '08:00'}
                onChange={(e) =>
                  setCreatingSlot((prev) => (prev ? { ...prev, endTime: e.target.value } : null))
                }
                required
              />
            </FormField>
          </div>
          <FormField label="Max Capacity" required>
            <Input
              type="number"
              min={1}
              value={creatingSlot?.maxCapacity ?? 20}
              onChange={(e) =>
                setCreatingSlot((prev) =>
                  prev ? { ...prev, maxCapacity: Number(e.target.value) } : null,
                )
              }
              required
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreatingSlot(null)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        title="Edit Schedule Slot"
        size="md"
      >
        <form onSubmit={handleUpdateSlot} className="space-y-4">
          <FormField label="Class Type" required>
            <Select
              value={editingSlot?.classTypeId ?? ''}
              onChange={(e) =>
                setEditingSlot((prev) => (prev ? { ...prev, classTypeId: e.target.value } : null))
              }
              required
            >
              <option value="">Select class</option>
              {classTypes
                .filter((c) => c.isActive)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </Select>
          </FormField>
          <FormField label="Coach" required>
            <Select
              value={editingSlot?.coachId ?? ''}
              onChange={(e) =>
                setEditingSlot((prev) => (prev ? { ...prev, coachId: e.target.value } : null))
              }
              required
            >
              <option value="">Select coach</option>
              {coaches
                .filter((c) => c.isActive)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </Select>
          </FormField>
          <FormField label="Location" required>
            <Select
              value={editingSlot?.locationId ?? ''}
              onChange={(e) =>
                setEditingSlot((prev) => (prev ? { ...prev, locationId: e.target.value } : null))
              }
              required
            >
              <option value="">Select location</option>
              {activeLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Start Time" required>
              <Input
                type="time"
                value={editingSlot?.startTime ?? ''}
                onChange={(e) =>
                  setEditingSlot((prev) => (prev ? { ...prev, startTime: e.target.value } : null))
                }
                required
              />
            </FormField>
            <FormField label="End Time" required>
              <Input
                type="time"
                value={editingSlot?.endTime ?? ''}
                onChange={(e) =>
                  setEditingSlot((prev) => (prev ? { ...prev, endTime: e.target.value } : null))
                }
                required
              />
            </FormField>
          </div>
          <FormField label="Max Capacity" required>
            <Input
              type="number"
              min={1}
              value={editingSlot?.maxCapacity ?? 20}
              onChange={(e) =>
                setEditingSlot((prev) =>
                  prev ? { ...prev, maxCapacity: Number(e.target.value) } : null,
                )
              }
              required
            />
          </FormField>
          <div className="flex justify-between">
            <Button
              type="button"
              variant="accent"
              onClick={() => {
                setDeletingSlot(editingSlot);
                setEditingSlot(null);
              }}
            >
              Delete Slot
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditingSlot(null)}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deletingSlot}
        onClose={() => setDeletingSlot(null)}
        title="Delete Schedule Slot"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this schedule slot? This action cannot be undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeletingSlot(null)}>
            Keep
          </Button>
          <Button variant="accent" loading={saving} onClick={handleDeleteSlot}>
            Yes, Delete
          </Button>
        </div>
      </Modal>

      <Modal
        open={creatingException}
        onClose={() => setCreatingException(false)}
        title="Add Schedule Exception"
        size="md"
      >
        <form onSubmit={handleCreateException} className="space-y-4">
          <FormField label="Date" required>
            <Input
              type="date"
              value={exDate}
              onChange={(e) => setExDate(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Location" required>
            <Select
              value={exLocationId || filterLocId || ''}
              onChange={(e) => setExLocationId(e.target.value)}
              required
            >
              <option value="">Select location</option>
              {activeLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Type">
            <Select
              value={exIsClosed ? 'closed' : 'modified'}
              onChange={(e) => setExIsClosed(e.target.value === 'closed')}
            >
              <option value="closed">Closed (full day)</option>
              <option value="modified">Modified hours</option>
            </Select>
          </FormField>
          {!exIsClosed && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Open Time" required>
                <Input
                  type="time"
                  value={exOpenTime}
                  onChange={(e) => setExOpenTime(e.target.value)}
                  required
                />
              </FormField>
              <FormField label="Close Time" required>
                <Input
                  type="time"
                  value={exCloseTime}
                  onChange={(e) => setExCloseTime(e.target.value)}
                  required
                />
              </FormField>
            </div>
          )}
          <FormField label="Reason" required>
            <Input
              value={exReason}
              onChange={(e) => setExReason(e.target.value)}
              placeholder="e.g. Christmas Day"
              required
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreatingException(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Add Exception
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
