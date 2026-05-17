import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { Skeleton } from '@/components/ui/Skeleton';
import { useSettings } from '@/hooks/useSettings';
import type { AdminSettings } from '@/api/admin';

const DAY_KEYS = [1, 2, 3, 4, 5, 6, 7] as const;
const DAY_LABEL_MAP: Record<number, string> = {
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
  7: 'sunday',
};

const TZ_OPTIONS = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
];

const CURRENCY_OPTIONS = [
  { value: 'EUR', labelKey: 'eur' },
  { value: 'USD', labelKey: 'usd' },
  { value: 'GBP', labelKey: 'gbp' },
];

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const { data: settings, loading, update, saving, error } = useSettings();
  const [success, setSuccess] = useState(false);
  const [draft, setDraft] = useState<AdminSettings | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (settings) setDraft(settings);
  }, [settings]);

  function updateDraft<K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) {
    if (!draft) return;
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateBusinessHours(
    day: number,
    field: 'open' | 'close' | 'isClosed',
    value: string | boolean,
  ) {
    if (!draft) return;
    setDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        businessHours: {
          ...prev.businessHours,
          [day]: { ...prev.businessHours[day], [field]: value },
        },
      };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSuccess(false);
    try {
      await update(draft);
      setSuccess(true);
    } catch {
      /* error is set by hook */
    }
  }

  if (loading || !draft)
    return (
      <div className="space-y-6">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );

  return (
    <>
      <SEO title={t('seo.adminSettingsTitle')} description={t('seo.adminSettingsDescription')} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('adminSettings.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('adminSettings.subtitle')}</p>
      </div>
      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {t('adminSettings.saved')}
        </div>
      )}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('adminSettings.general')}</h2>
            <p className="text-sm text-gray-500">{t('adminSettings.generalDesc')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t('adminSettings.studioName')} required>
              <Input
                value={draft.studioName}
                onChange={(e) => updateDraft('studioName', e.target.value)}
                required
              />
            </FormField>
            <FormField label={t('adminSettings.studioEmail')} required>
              <Input
                type="email"
                value={draft.studioEmail}
                onChange={(e) => updateDraft('studioEmail', e.target.value)}
                required
              />
            </FormField>
            <FormField label={t('adminSettings.studioPhone')} required>
              <Input
                value={draft.studioPhone}
                onChange={(e) => updateDraft('studioPhone', e.target.value)}
                required
              />
            </FormField>
            <FormField label={t('adminSettings.studioAddress')}>
              <Input
                value={draft.studioAddress}
                onChange={(e) => updateDraft('studioAddress', e.target.value)}
              />
            </FormField>
            <FormField label={t('adminSettings.studioCity')}>
              <Input
                value={draft.studioCity}
                onChange={(e) => updateDraft('studioCity', e.target.value)}
              />
            </FormField>
            <FormField label={t('adminSettings.timezone')} required>
              <Select
                value={draft.timezone}
                onChange={(e) => updateDraft('timezone', e.target.value)}
              >
                {TZ_OPTIONS.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label={t('adminSettings.defaultCurrency')} required>
              <Select
                value={draft.defaultCurrency}
                onChange={(e) => updateDraft('defaultCurrency', e.target.value)}
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {t(`adminSettings.${c.labelKey}`)}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('adminSettings.businessHours')}
            </h2>
            <p className="text-sm text-gray-500">{t('adminSettings.businessHoursDesc')}</p>
          </div>
          <div className="space-y-2">
            {DAY_KEYS.map((day) => {
              const entry = draft.businessHours[day] ?? {
                open: '09:00',
                close: '17:00',
                isClosed: false,
              };
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-medium text-gray-700">
                    {t(`bookingPage.days.${DAY_LABEL_MAP[day]}`)}
                  </span>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={entry.isClosed}
                      onChange={(e) => updateBusinessHours(day, 'isClosed', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    {t('adminSettings.closed')}
                  </label>
                  {!entry.isClosed && (
                    <>
                      <Input
                        type="time"
                        value={entry.open}
                        onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-sm text-gray-400">{t('adminSettings.openTime')}</span>
                      <Input
                        type="time"
                        value={entry.close}
                        onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                        className="w-32"
                      />
                      <span className="text-sm text-gray-400">{t('adminSettings.closeTime')}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('adminSettings.bookingRules')}
            </h2>
            <p className="text-sm text-gray-500">{t('adminSettings.bookingRulesDesc')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              label={t('adminSettings.leadTime')}
              helpText={t('adminSettings.leadTimeDesc')}
            >
              <Input
                type="number"
                min={0}
                value={draft.bookingLeadTimeMinutes}
                onChange={(e) => update('bookingLeadTimeMinutes', Number(e.target.value))}
              />
            </FormField>
            <FormField
              label={t('adminSettings.cancellationWindow')}
              helpText={t('adminSettings.cancellationWindowDesc')}
            >
              <Input
                type="number"
                min={0}
                value={draft.cancellationWindowMinutes}
                onChange={(e) => update('cancellationWindowMinutes', Number(e.target.value))}
              />
            </FormField>
            <FormField
              label={t('adminSettings.maxBookings')}
              helpText={t('adminSettings.maxBookingsDesc')}
            >
              <Input
                type="number"
                min={0}
                value={draft.maxBookingsPerCustomer}
                onChange={(e) => update('maxBookingsPerCustomer', Number(e.target.value))}
              />
            </FormField>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('adminSettings.notifications')}
            </h2>
            <p className="text-sm text-gray-500">{t('adminSettings.notificationsDesc')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t('adminSettings.defaultSender')} required>
              <Input
                type="email"
                value={draft.defaultEmailSender}
                onChange={(e) => update('defaultEmailSender', e.target.value)}
                required
              />
            </FormField>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                'notifyOnBooking',
                'notifyOnCancellation',
                'notifyOnWaitlist',
                'notifyOnReminder',
              ] as const
            ).map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={draft[key]}
                  onChange={(e) => updateDraft(key, e.target.checked)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                {t(`adminSettings.${key}`)}
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('adminSettings.payments')}</h2>
            <p className="text-sm text-gray-500">{t('adminSettings.paymentsDesc')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t('adminSettings.taxRate')}>
              <Input
                type="number"
                min={0}
                step={0.1}
                value={draft.taxRate}
                onChange={(e) => update('taxRate', Number(e.target.value))}
              />
            </FormField>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} size="lg">
            {t('common.saveChanges')}
          </Button>
        </div>
      </form>
    </>
  );
}
