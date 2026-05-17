import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { useClassTypes } from '@/hooks/useClassTypes';
import type { ClassType } from '@/types';
import { formatCurrency } from '@/lib/format';

const emptyForm = {
  name: '',
  description: '',
  color: '#0ea5e9',
  durationMinutes: 60,
  capacity: 20,
  defaultPriceCents: 2000,
  isActive: true,
};

export default function ClassesPage() {
  const { t } = useTranslation();
  const { data: classTypes, loading, create, update, remove } = useClassTypes();

  const [editing, setEditing] = useState<ClassType | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ClassType | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setForm(emptyForm);
    setCreating(true);
  }

  function openEdit(ct: ClassType) {
    setForm({
      name: ct.name,
      description: ct.description,
      color: ct.color,
      durationMinutes: ct.durationMinutes,
      capacity: ct.capacity,
      defaultPriceCents: ct.defaultPriceCents,
      isActive: ct.isActive,
    });
    setEditing(ct);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const payload = {
        ...form,
        slug,
        maxCapacity: form.capacity,
        intensityLevel: null,
        imageUrl: null,
        sortOrder: 0,
      };
      if (editing) {
        await update(editing.id, payload as Parameters<typeof update>[1]);
        setEditing(null);
      } else {
        await create(payload as Parameters<typeof create>[0]);
        setCreating(false);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setSaving(true);
    try {
      await remove(deleting.id);
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
      <SEO title={t('seo.adminClassesTitle')} description={t('seo.adminClassesDescription')} />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('adminClasses.heading')}</h1>
          <p className="mt-1 text-gray-500">{t('adminClasses.subtitle')}</p>
        </div>
        <Button onClick={openCreate}>{t('adminClasses.addClass')}</Button>
      </div>
      {!classTypes || classTypes.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">
            {t('adminClasses.noClasses')}
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classTypes.map((ct) => (
            <Card key={ct.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: ct.color }} />
                  <div>
                    <p className="font-medium text-gray-900">{ct.name}</p>
                    <p className="text-xs text-gray-500">{ct.durationMinutes} min</p>
                  </div>
                </div>
                <Badge color={ct.isActive ? 'green' : 'gray'}>
                  {ct.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{ct.description}</p>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                <span>{t('adminClasses.capacity', { count: ct.capacity })}</span>
                <span>{formatCurrency(ct.defaultPriceCents)}</span>
              </div>
              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(ct)}>
                  {t('common.edit')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(ct)}>
                  {t('common.delete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={creating || !!editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        title={creating ? t('adminClasses.addTitle') : t('adminClasses.editTitle')}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label={t('adminClasses.name')} required>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </FormField>
          <FormField label={t('adminClasses.description')} required>
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('adminClasses.color')} required>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                  className="h-9 w-9 cursor-pointer rounded border"
                />
                <Input
                  value={form.color}
                  onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                  required
                />
              </div>
            </FormField>
            <FormField label={t('adminClasses.duration')} required>
              <Input
                type="number"
                min={5}
                step={5}
                value={form.durationMinutes}
                onChange={(e) =>
                  setForm((p) => ({ ...p, durationMinutes: Number(e.target.value) }))
                }
                required
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('adminClasses.maxCapacity')} required>
              <Input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))}
                required
              />
            </FormField>
            <FormField label={t('adminClasses.defaultPrice')} required>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.defaultPriceCents / 100}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    defaultPriceCents: Math.round(Number(e.target.value) * 100),
                  }))
                }
                required
              />
            </FormField>
          </div>
          <FormField label={t('adminClasses.status')}>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              {t('adminClasses.active')}
            </label>
          </FormField>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setCreating(false);
                setEditing(null);
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
        title={t('adminClasses.deleteTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600">
          {t('adminClasses.deleteBody', { name: deleting?.name })}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            {t('adminClasses.keep')}
          </Button>
          <Button variant="accent" loading={saving} onClick={handleDelete}>
            {t('adminClasses.yesDelete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
