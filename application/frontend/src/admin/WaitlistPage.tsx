import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import {
  fetchAdminWaitlist,
  promoteWaitlistEntry,
  removeWaitlistEntry,
  notifyAllWaitlist,
  fetchWeeklySchedule,
  fetchAllClassTypes,
} from '@/api/admin';
import type { EnrichedWaitlistEntry } from '@/api/admin';
import type { WeeklyScheduleItem } from '@/api/admin';
import type { ClassType } from '@/types';

export default function WaitlistPage() {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState<WeeklyScheduleItem[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [entries, setEntries] = useState<EnrichedWaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [notifyMsg, setNotifyMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [sched, cts] = await Promise.all([fetchWeeklySchedule(), fetchAllClassTypes()]);
        if (!cancelled) {
          setSchedules(sched);
          setClassTypes(cts);
        }
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

  useEffect(() => {
    if (!selectedScheduleId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchAdminWaitlist(selectedScheduleId, selectedDate);
        if (!cancelled) setEntries(data);
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
  }, [selectedScheduleId, selectedDate]);

  async function handlePromote(id: string) {
    setActionLoading(true);
    try {
      await promoteWaitlistEntry(id);
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'promoted' } : e)));
    } catch {
      // non-fatal
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemove(id: string) {
    setActionLoading(true);
    try {
      await removeWaitlistEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      // non-fatal
    } finally {
      setActionLoading(false);
    }
  }

  async function handleNotifyAll() {
    setActionLoading(true);
    setNotifyMsg('');
    try {
      const result = await notifyAllWaitlist(selectedScheduleId, selectedDate);
      setNotifyMsg(result.message);
    } catch {
      // non-fatal
    } finally {
      setActionLoading(false);
    }
  }

  const waitingEntries = entries.filter((e) => e.status === 'waiting');
  const promotedEntries = entries.filter((e) => e.status === 'promoted');

  function formatScheduleLabel(s: WeeklyScheduleItem) {
    const ct = classTypes.find((c) => c.id === s.classTypeId);
    return (
      (ct?.name ?? t('common.classes')) +
      ' (Day ' +
      s.dayOfWeek +
      ', ' +
      s.startTime +
      '-' +
      s.endTime +
      ')'
    );
  }

  return (
    <>
      <SEO title={t('seo.adminWaitlistTitle')} description={t('seo.adminWaitlistDescription')} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('adminWaitlist.heading')}</h1>
          <p className="mt-1 text-gray-500">{t('adminWaitlist.subtitle')}</p>
        </div>
      </div>

      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-60">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              {t('adminWaitlist.classSlot')}
            </label>
            <Select
              value={selectedScheduleId}
              onChange={(e) => setSelectedScheduleId(e.target.value)}
            >
              <option value="">{t('adminWaitlist.selectClass')}</option>
              {schedules.map((s) => (
                <option key={s.id} value={s.id}>
                  {formatScheduleLabel(s)}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-40">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              {t('adminWaitlist.date')}
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <Button
            onClick={handleNotifyAll}
            disabled={!selectedScheduleId || waitingEntries.length === 0}
            loading={actionLoading}
          >
            {t('adminWaitlist.notifyAll', { count: waitingEntries.length })}
          </Button>
        </div>
        {notifyMsg && <p className="mt-3 text-sm text-green-600">{notifyMsg}</p>}
      </Card>

      {!selectedScheduleId ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminWaitlist.selectPrompt')}
          </div>
        </Card>
      ) : loading ? (
        <Spinner centered size="lg" />
      ) : entries.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminWaitlist.noEntries')}
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {waitingEntries.length > 0 && (
            <Card>
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                {t('adminWaitlist.waiting', { count: waitingEntries.length })}
              </h2>
              <div className="space-y-2">
                {waitingEntries.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                        #{e.position}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{e.customerName}</p>
                        <p className="text-xs text-gray-500">{e.className}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handlePromote(e.id)} loading={actionLoading}>
                        {t('adminWaitlist.promote')}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemove(e.id)}
                        loading={actionLoading}
                      >
                        {t('adminWaitlist.remove')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {promotedEntries.length > 0 && (
            <Card>
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                {t('adminWaitlist.promoted', { count: promotedEntries.length })}
              </h2>
              <div className="space-y-2">
                {promotedEntries.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between rounded-lg bg-green-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                        #{e.position}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{e.customerName}</p>
                        <p className="text-xs text-gray-500">{e.className}</p>
                      </div>
                    </div>
                    <Badge color="green">{t('adminWaitlist.promotedBadge')}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  );
}
