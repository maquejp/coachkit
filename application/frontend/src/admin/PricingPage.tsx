import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { usePointCardPlans } from '@/hooks/usePointCardPlans';
import { formatCurrency } from '@/lib/format';

const emptySubForm = {
  name: '',
  description: '',
  priceCents: 9900,
  interval: 'monthly' as const,
  trialDays: 7,
  features: [] as string[],
  isActive: true,
};

const emptyPcForm = {
  name: '',
  description: '',
  priceCents: 9000,
  sessionsCount: 5,
  validityDays: 90,
  isActive: true,
};

export default function PricingPage() {
  const { t } = useTranslation();
  const {
    data: subPlans,
    loading: subLoading,
    create,
    update,
    remove: deleteSub,
  } = useSubscriptionPlans();
  const {
    data: pcPlans,
    loading: pcLoading,
    create: createPc,
    update: updatePc,
    remove: deletePc,
  } = usePointCardPlans();
  const [saving, setSaving] = useState(false);

  const [creating, setCreating] = useState<'sub' | 'pc' | null>(null);
  const [editing, setEditing] = useState<'sub' | 'pc' | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<{ type: 'sub' | 'pc'; id: string; name: string } | null>(
    null,
  );

  const [subForm, setSubForm] = useState(emptySubForm);
  const [pcForm, setPcForm] = useState(emptyPcForm);
  const [featuresText, setFeaturesText] = useState('');

  const loading = subLoading || pcLoading;

  function openCreateSub() {
    setSubForm(emptySubForm);
    setFeaturesText('');
    setCreating('sub');
  }

  function openCreatePc() {
    setPcForm(emptyPcForm);
    setCreating('pc');
  }

  function openEditSub(p: NonNullable<typeof subPlans>[number]) {
    setSubForm({
      name: p.name,
      description: p.description,
      priceCents: p.priceCents,
      interval: p.interval,
      trialDays: p.trialDays,
      features: p.features,
      isActive: p.isActive,
    });
    setFeaturesText(p.features.join('\n'));
    setEditing('sub');
    setEditingId(p.id);
  }

  function openEditPc(p: NonNullable<typeof pcPlans>[number]) {
    setPcForm({
      name: p.name,
      description: p.description,
      priceCents: p.priceCents,
      sessionsCount: p.sessionsCount,
      validityDays: p.validityDays,
      isActive: p.isActive,
    });
    setEditing('pc');
    setEditingId(p.id);
  }

  async function handleSaveSub(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...subForm, features: featuresText.split('\n').filter(Boolean) };
      if (editingId) {
        await update(editingId, payload);
        setEditing(null);
        setEditingId(null);
      } else {
        await create(payload as Parameters<typeof create>[0]);
        setCreating(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSavePc(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updatePc(editingId, pcForm);
        setEditing(null);
        setEditingId(null);
      } else {
        await createPc(pcForm);
        setCreating(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setSaving(true);
    try {
      if (deleting.type === 'sub') {
        await deleteSub(deleting.id);
      } else {
        await deletePc(deleting.id);
      }
      setDeleting(null);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton variant="card" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );

  return (
    <>
      <SEO title={t('seo.adminPricingTitle')} description={t('seo.adminPricingDescription')} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('adminPricing.heading')}</h1>
          <p className="mt-1 text-gray-500">{t('adminPricing.subtitle')}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('adminPricing.subscriptionPlans')}
          </h2>
          <Button onClick={openCreateSub}>{t('adminPricing.addPlan')}</Button>
        </div>
        {!subPlans || subPlans.length === 0 ? (
          <Card>
            <div className="py-8 text-center text-sm text-gray-400">
              {t('adminPricing.noPlans')}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subPlans.map((p) => (
              <Card key={p.id} hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.description}</p>
                  </div>
                  <Badge color={p.isActive ? 'green' : 'gray'}>
                    {p.isActive ? t('common.active') : t('common.inactive')}
                  </Badge>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCurrency(p.priceCents)}
                  <span className="text-sm font-normal text-gray-500">/{p.interval}</span>
                </p>
                {p.trialDays > 0 && (
                  <p className="text-xs text-gray-500">
                    {t('adminPricing.trialDays', { count: p.trialDays })}
                  </p>
                )}
                {p.features && p.features.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1 text-xs text-gray-600">
                        <span className="text-primary-500">{'\u2713'}</span> {f}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                  <Button size="sm" variant="outline" onClick={() => openEditSub(p)}>
                    {t('common.edit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleting({ type: 'sub', id: p.id, name: p.name })}
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('adminPricing.pointCardPacks')}
          </h2>
          <Button onClick={openCreatePc}>{t('adminPricing.addPack')}</Button>
        </div>
        {!pcPlans || pcPlans.length === 0 ? (
          <Card>
            <div className="py-8 text-center text-sm text-gray-400">
              {t('adminPricing.noPacks')}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pcPlans.map((p) => (
              <Card key={p.id} hover>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.description}</p>
                  </div>
                  <Badge color={p.isActive ? 'green' : 'gray'}>
                    {p.isActive ? t('common.active') : t('common.inactive')}
                  </Badge>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCurrency(p.priceCents)}
                </p>
                <p className="text-xs text-gray-500">
                  {t('adminPricing.packInfo', { sessions: p.sessionsCount, days: p.validityDays })}
                </p>
                <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                  <Button size="sm" variant="outline" onClick={() => openEditPc(p)}>
                    {t('common.edit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeleting({ type: 'pc', id: p.id, name: p.name })}
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={creating === 'sub' || editing === 'sub'}
        onClose={() => {
          setCreating(null);
          setEditing(null);
          setEditingId(null);
        }}
        title={editing ? t('adminPricing.editPlanTitle') : t('adminPricing.addPlanTitle')}
        size="md"
      >
        <form onSubmit={handleSaveSub} className="space-y-4">
          <FormField label={t('adminPricing.name')} required>
            <Input
              value={subForm.name}
              onChange={(e) => setSubForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </FormField>
          <FormField label={t('adminPricing.description')} required>
            <Input
              value={subForm.description}
              onChange={(e) => setSubForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('adminPricing.price')} required>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={subForm.priceCents / 100}
                onChange={(e) =>
                  setSubForm((p) => ({
                    ...p,
                    priceCents: Math.round(Number(e.target.value) * 100),
                  }))
                }
                required
              />
            </FormField>
            <FormField label={t('adminPricing.billingInterval')} required>
              <Select
                value={subForm.interval}
                onChange={(e) =>
                  setSubForm((p) => ({ ...p, interval: e.target.value as 'monthly' | 'yearly' }))
                }
              >
                <option value="monthly">{t('adminPricing.monthly')}</option>
                <option value="yearly">{t('adminPricing.yearly')}</option>
              </Select>
            </FormField>
          </div>
          <FormField label={t('adminPricing.trialDays')}>
            <Input
              type="number"
              min={0}
              value={subForm.trialDays}
              onChange={(e) => setSubForm((p) => ({ ...p, trialDays: Number(e.target.value) }))}
            />
          </FormField>
          <FormField label={t('adminPricing.features')}>
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              rows={4}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder={t('adminPricing.featuresPlaceholder')}
            />
          </FormField>
          <FormField label={t('adminPricing.status')}>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={subForm.isActive}
                onChange={(e) => setSubForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              {t('adminPricing.active')}
            </label>
          </FormField>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setCreating(null);
                setEditing(null);
                setEditingId(null);
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? t('common.save') : t('common.create')}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={creating === 'pc' || editing === 'pc'}
        onClose={() => {
          setCreating(null);
          setEditing(null);
          setEditingId(null);
        }}
        title={editing ? t('adminPricing.editPackTitle') : t('adminPricing.addPackTitle')}
        size="md"
      >
        <form onSubmit={handleSavePc} className="space-y-4">
          <FormField label={t('adminPricing.name')} required>
            <Input
              value={pcForm.name}
              onChange={(e) => setPcForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </FormField>
          <FormField label={t('adminPricing.description')} required>
            <Input
              value={pcForm.description}
              onChange={(e) => setPcForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('adminPricing.price')} required>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={pcForm.priceCents / 100}
                onChange={(e) =>
                  setPcForm((p) => ({ ...p, priceCents: Math.round(Number(e.target.value) * 100) }))
                }
                required
              />
            </FormField>
            <FormField label={t('adminPricing.sessions')} required>
              <Input
                type="number"
                min={1}
                value={pcForm.sessionsCount}
                onChange={(e) =>
                  setPcForm((p) => ({ ...p, sessionsCount: Number(e.target.value) }))
                }
                required
              />
            </FormField>
          </div>
          <FormField label={t('adminPricing.validityDays')} required>
            <Input
              type="number"
              min={1}
              value={pcForm.validityDays}
              onChange={(e) => setPcForm((p) => ({ ...p, validityDays: Number(e.target.value) }))}
              required
            />
          </FormField>
          <FormField label={t('adminPricing.status')}>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={pcForm.isActive}
                onChange={(e) => setPcForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              {t('adminPricing.active')}
            </label>
          </FormField>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setCreating(null);
                setEditing(null);
                setEditingId(null);
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? t('common.save') : t('common.create')}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={t('adminPricing.deleteTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600">
          {t('adminPricing.deleteBody', { name: deleting?.name })}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            {t('common.keep')}
          </Button>
          <Button variant="accent" loading={saving} onClick={handleDelete}>
            {t('common.yesDelete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
