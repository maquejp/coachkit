import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { Spinner } from '@/components/ui/Spinner';
import { fetchSettings, updateSettings } from '@/api/admin';
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
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchSettings();
        if (!cancelled) setSettings(data);
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

  function update<K extends keyof AdminSettings>(key: K, value: AdminSettings[K]) {
    if (!settings) return;
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateBusinessHours(
    day: number,
    field: 'open' | 'close' | 'isClosed',
    value: string | boolean,
  ) {
    if (!settings) return;
    setSettings((prev) => {
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
    if (!settings) return;
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      await updateSettings(settings);
      setSuccess(true);
    } catch {
      setError(t('adminSettings.saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner centered size="lg" />;
  if (!settings) return null;

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
                value={settings.studioName}
                onChange={(e) => update('studioName', e.target.value)}
                required
              />
            </FormField>
            <FormField label={t('adminSettings.studioEmail')} required>
              <Input
                type="email"
                value={settings.studioEmail}
                onChange={(e) => update('studioEmail', e.target.value)}
                required
              />
            </FormField>
            <FormField label={t('adminSettings.studioPhone')} required>
              <Input
                value={settings.studioPhone}
                onChange={(e) => update('studioPhone', e.target.value)}
                required
              />
            </FormField>
            <FormField label={t('adminSettings.studioAddress')}>
              <Input
                value={settings.studioAddress}
                onChange={(e) => update('studioAddress', e.target.value)}
              />
            </FormField>
            <FormField label={t('adminSettings.studioCity')}>
              <Input
                value={settings.studioCity}
                onChange={(e) => update('studioCity', e.target.value)}
              />
            </FormField>
            <FormField label={t('adminSettings.timezone')} required>
              <Select
                value={settings.timezone}
                onChange={(e) => update('timezone', e.target.value)}
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
                value={settings.defaultCurrency}
                onChange={(e) => update('defaultCurrency', e.target.value)}
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
              const entry = settings.businessHours[day] ?? {
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
                value={settings.bookingLeadTimeMinutes}
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
                value={settings.cancellationWindowMinutes}
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
                value={settings.maxBookingsPerCustomer}
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
                value={settings.defaultEmailSender}
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
                  checked={settings[key]}
                  onChange={(e) => update(key, e.target.checked)}
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
                value={settings.taxRate}
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
