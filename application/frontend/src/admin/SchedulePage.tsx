import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { useWeeklySchedule } from '@/hooks/useWeeklySchedule';
import { useScheduleExceptions } from '@/hooks/useScheduleExceptions';
import { useClassTypes } from '@/hooks/useClassTypes';
import { useCoaches } from '@/hooks/useCoaches';
import { useLocations } from '@/hooks/useLocations';
import type { WeeklyScheduleItem } from '@/api/admin';

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
  const { t } = useTranslation();
  const {
    data: schedules,
    create: createSchedule,
    update: updateSchedule,
    remove: deleteSchedule,
  } = useWeeklySchedule();
  const { data: exceptions, refetch: refetchExceptions } = useScheduleExceptions();
  const { data: classTypes } = useClassTypes();
  const { data: coaches } = useCoaches();
  const { data: locations } = useLocations();

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

  const sched = schedules ?? [];
  const exc = exceptions ?? [];
  const cts = classTypes ?? [];
  const cos = coaches ?? [];
  const locs = locations ?? [];

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (sched.length > 0 || exc.length > 0 || cts.length > 0 || cos.length > 0 || locs.length > 0) {
      setLoading(false);
    } else {
      const timer = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timer);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [sched, exc, cts, cos, locs]);

  const activeLocations = locs.filter((l) => l.isActive);

  const filteredSchedules = filterLocId ? sched.filter((s) => s.locationId === filterLocId) : sched;
  const filteredExceptions = filterLocId ? exc.filter((e) => e.locationId === filterLocId) : exc;

  function getSlotForm(slot: WeeklyScheduleItem): Parameters<typeof updateSchedule>[1] {
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
      await createSchedule({
        dayOfWeek: creatingSlot.dayOfWeek,
        classTypeId: creatingSlot.classTypeId,
        coachId: creatingSlot.coachId,
        locationId: creatingSlot.locationId || filterLocId || activeLocations[0]?.id || '',
        startTime: creatingSlot.startTime,
        endTime: creatingSlot.endTime,
        maxCapacity: creatingSlot.maxCapacity,
        isActive: true,
      });
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
      await updateSchedule(editingSlot.id, getSlotForm(editingSlot));
      setEditingSlot(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSlot() {
    if (!deletingSlot) return;
    setSaving(true);
    try {
      await deleteSchedule(deletingSlot.id);
      setDeletingSlot(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateException(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/schedule-exceptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: exDate,
          locationId: exLocationId || filterLocId || activeLocations[0]?.id || '',
          isClosed: exIsClosed,
          openTime: exIsClosed ? null : exOpenTime,
          closeTime: exIsClosed ? null : exCloseTime,
          reason: exReason,
        }),
      });
      if (res.ok) {
        refetchExceptions();
        setCreatingException(false);
        setExDate('');
        setExReason('');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteException(id: string) {
    await fetch(`/api/admin/schedule-exceptions/${id}`, { method: 'DELETE' });
    refetchExceptions();
  }

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );

  return (
    <>
      <SEO title={t('seo.adminScheduleTitle')} description={t('seo.adminScheduleDescription')} />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('adminSchedule.heading')}</h1>
          <p className="mt-1 text-gray-500">{t('adminSchedule.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={filterLocId}
            onChange={(e) => setFilterLocId(e.target.value)}
            className="w-48"
          >
            <option value="">{t('adminSchedule.allLocations')}</option>
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
            <div className="p-2 text-xs font-medium text-gray-500">{t('adminSchedule.time')}</div>
            {DAYS.map((d) => (
              <div key={d} className="p-2 text-center text-xs font-medium text-gray-500">
                {t('bookingPage.days.' + d.toLowerCase())}
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
                        {t('adminSchedule.addSlot')}
                      </button>
                    ) : (
                      <div className="space-y-0.5">
                        {slots.map((slot) => {
                          const ct = cts.find((c) => c.id === slot.classTypeId);
                          return (
                            <button
                              key={slot.id}
                              onClick={() => setEditingSlot(slot)}
                              className="w-full rounded px-1 py-0.5 text-left text-xs text-gray-900 transition-colors hover:opacity-80"
                              style={{ backgroundColor: ct?.color ? ct.color + '20' : '#e0f2fe' }}
                            >
                              <div className="flex items-center gap-1">
                                <span className="font-medium truncate">
                                  {ct?.name ?? t('common.classes')}
                                </span>
                              </div>
                              <span className="text-gray-600">
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
            <h2 className="text-lg font-semibold text-gray-900">
              {t('adminSchedule.scheduleExceptions')}
            </h2>
            <p className="text-sm text-gray-500">{t('adminSchedule.exceptionsSubtitle')}</p>
          </div>
          <Button onClick={() => setCreatingException(true)}>
            {t('adminSchedule.addException')}
          </Button>
        </div>
        {filteredExceptions.length === 0 ? (
          <Card>
            <div className="py-8 text-center text-sm text-gray-400">
              {t('adminSchedule.noExceptions')}
            </div>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredExceptions.map((ex) => {
              const loc = locs.find((l) => l.id === ex.locationId);
              return (
                <Card key={ex.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {ex.date} — {ex.reason}
                      </p>
                      <p className="text-xs text-gray-500">
                        {loc ? loc.name : t('adminSchedule.unknownLocation')}
                        {ex.isClosed
                          ? ` · ${t('adminSchedule.closed')}`
                          : ` · ${formatTime(ex.openTime ?? '')}–${formatTime(ex.closeTime ?? '')}`}
                      </p>
                    </div>
                    <Badge color={ex.isClosed ? 'accent' : 'warm'}>
                      {ex.isClosed ? t('adminSchedule.closed') : t('adminSchedule.modified')}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteException(ex.id)}>
                      {t('adminSchedule.remove')}
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
        title={t('adminSchedule.createSlotTitle')}
        size="md"
      >
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <FormField label={t('adminSchedule.classType')} required>
            <Select
              value={creatingSlot?.classTypeId ?? ''}
              onChange={(e) =>
                setCreatingSlot((prev) => (prev ? { ...prev, classTypeId: e.target.value } : null))
              }
              required
            >
              <option value="">{t('adminSchedule.selectClass')}</option>
              {cts
                .filter((c) => c.isActive)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </Select>
          </FormField>
          <FormField label={t('adminSchedule.coach')} required>
            <Select
              value={creatingSlot?.coachId ?? ''}
              onChange={(e) =>
                setCreatingSlot((prev) => (prev ? { ...prev, coachId: e.target.value } : null))
              }
              required
            >
              <option value="">{t('adminSchedule.selectCoach')}</option>
              {cos
                .filter((c) => c.isActive)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </Select>
          </FormField>
          <FormField label={t('adminSchedule.locationField')} required>
            <Select
              value={creatingSlot?.locationId || filterLocId || ''}
              onChange={(e) =>
                setCreatingSlot((prev) => (prev ? { ...prev, locationId: e.target.value } : null))
              }
              required
            >
              <option value="">{t('adminSchedule.selectLocation')}</option>
              {activeLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('adminSchedule.startTime')} required>
              <Input
                type="time"
                value={creatingSlot?.startTime ?? '07:00'}
                onChange={(e) =>
                  setCreatingSlot((prev) => (prev ? { ...prev, startTime: e.target.value } : null))
                }
                required
              />
            </FormField>
            <FormField label={t('adminSchedule.endTime')} required>
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
          <FormField label={t('adminSchedule.maxCapacity')} required>
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
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={saving}>
              {t('common.create')}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        title={t('adminSchedule.editSlotTitle')}
        size="md"
      >
        <form onSubmit={handleUpdateSlot} className="space-y-4">
          <FormField label={t('adminSchedule.classType')} required>
            <Select
              value={editingSlot?.classTypeId ?? ''}
              onChange={(e) =>
                setEditingSlot((prev) => (prev ? { ...prev, classTypeId: e.target.value } : null))
              }
              required
            >
              <option value="">{t('adminSchedule.selectClass')}</option>
              {cts
                .filter((c) => c.isActive)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </Select>
          </FormField>
          <FormField label={t('adminSchedule.coach')} required>
            <Select
              value={editingSlot?.coachId ?? ''}
              onChange={(e) =>
                setEditingSlot((prev) => (prev ? { ...prev, coachId: e.target.value } : null))
              }
              required
            >
              <option value="">{t('adminSchedule.selectCoach')}</option>
              {cos
                .filter((c) => c.isActive)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </Select>
          </FormField>
          <FormField label={t('adminSchedule.locationField')} required>
            <Select
              value={editingSlot?.locationId ?? ''}
              onChange={(e) =>
                setEditingSlot((prev) => (prev ? { ...prev, locationId: e.target.value } : null))
              }
              required
            >
              <option value="">{t('adminSchedule.selectLocation')}</option>
              {activeLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('adminSchedule.startTime')} required>
              <Input
                type="time"
                value={editingSlot?.startTime ?? ''}
                onChange={(e) =>
                  setEditingSlot((prev) => (prev ? { ...prev, startTime: e.target.value } : null))
                }
                required
              />
            </FormField>
            <FormField label={t('adminSchedule.endTime')} required>
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
          <FormField label={t('adminSchedule.maxCapacity')} required>
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
              {t('adminSchedule.deleteSlotBtn')}
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditingSlot(null)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" loading={saving}>
                {t('common.save')}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deletingSlot}
        onClose={() => setDeletingSlot(null)}
        title={t('adminSchedule.deleteSlotTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600">{t('adminSchedule.deleteSlotBody')}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeletingSlot(null)}>
            {t('common.keep')}
          </Button>
          <Button variant="accent" loading={saving} onClick={handleDeleteSlot}>
            {t('common.yesDelete')}
          </Button>
        </div>
      </Modal>

      <Modal
        open={creatingException}
        onClose={() => setCreatingException(false)}
        title={t('adminSchedule.addExceptionTitle')}
        size="md"
      >
        <form onSubmit={handleCreateException} className="space-y-4">
          <FormField label={t('adminSchedule.date')} required>
            <Input
              type="date"
              value={exDate}
              onChange={(e) => setExDate(e.target.value)}
              required
            />
          </FormField>
          <FormField label={t('adminSchedule.locationField')} required>
            <Select
              value={exLocationId || filterLocId || ''}
              onChange={(e) => setExLocationId(e.target.value)}
              required
            >
              <option value="">{t('adminSchedule.selectLocation')}</option>
              {activeLocations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label={t('adminSchedule.type')}>
            <Select
              value={exIsClosed ? 'closed' : 'modified'}
              onChange={(e) => setExIsClosed(e.target.value === 'closed')}
            >
              <option value="closed">{t('adminSchedule.closedFullDay')}</option>
              <option value="modified">{t('adminSchedule.modifiedHours')}</option>
            </Select>
          </FormField>
          {!exIsClosed && (
            <div className="grid grid-cols-2 gap-4">
              <FormField label={t('adminSchedule.openTime')} required>
                <Input
                  type="time"
                  value={exOpenTime}
                  onChange={(e) => setExOpenTime(e.target.value)}
                  required
                />
              </FormField>
              <FormField label={t('adminSchedule.closeTime')} required>
                <Input
                  type="time"
                  value={exCloseTime}
                  onChange={(e) => setExCloseTime(e.target.value)}
                  required
                />
              </FormField>
            </div>
          )}
          <FormField label={t('adminSchedule.reason')} required>
            <Input
              value={exReason}
              onChange={(e) => setExReason(e.target.value)}
              placeholder={t('adminSchedule.reasonPlaceholder')}
              required
            />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setCreatingException(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={saving}>
              {t('adminSchedule.addException')}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
