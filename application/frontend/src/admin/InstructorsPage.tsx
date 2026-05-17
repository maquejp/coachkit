import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { useCoaches } from '@/hooks/useCoaches';
import type { Coach } from '@/types';

function CoachAvatar({ coach }: { coach: Coach }) {
  const [imgError, setImgError] = useState(false);
  if (coach.photoUrl && !imgError) {
    return (
      <img
        src={coach.photoUrl}
        alt={coach.name}
        loading="lazy"
        onError={() => setImgError(true)}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
      {coach.name.charAt(0)}
    </div>
  );
}

const emptyForm = { name: '', bio: '', email: '', phone: '', photoUrl: '', isActive: true };

export default function InstructorsPage() {
  const { t } = useTranslation();
  const { data: coaches, loading, create, update, remove, saving } = useCoaches();

  const [editing, setEditing] = useState<Coach | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Coach | null>(null);
  const [form, setForm] = useState(emptyForm);

  function openCreate() {
    setForm(emptyForm);
    setCreating(true);
  }

  function openEdit(coach: Coach) {
    setForm({
      name: coach.name,
      bio: coach.bio,
      email: coach.email,
      phone: coach.phone ?? '',
      photoUrl: coach.photoUrl ?? '',
      isActive: coach.isActive,
    });
    setEditing(coach);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const nameParts = form.name.trim().split(/\s+/);
    const payload = {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      bio: form.bio || null,
      email: form.email || null,
      phone: form.phone || null,
      photoUrl: form.photoUrl || null,
      isActive: form.isActive,
    };
    if (editing) {
      await update(editing.id, payload as Parameters<typeof update>[1]);
      setEditing(null);
    } else {
      await create(payload as Parameters<typeof create>[0]);
      setCreating(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    await remove(deleting.id);
    setDeleting(null);
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
      <SEO
        title={t('seo.adminInstructorsTitle')}
        description={t('seo.adminInstructorsDescription')}
      />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('adminInstructors.heading')}</h1>
          <p className="mt-1 text-gray-500">{t('adminInstructors.subtitle')}</p>
        </div>
        <Button onClick={openCreate}>{t('adminInstructors.addInstructor')}</Button>
      </div>
      {!coaches || coaches.length === 0 ? (
        <EmptyState message={t('adminInstructors.noInstructors')} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <Card key={coach.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CoachAvatar coach={coach} />
                  <div>
                    <Link
                      to={`/admin/instructors/${coach.id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {coach.name}
                    </Link>
                    <p className="text-xs text-gray-500">{coach.email}</p>
                  </div>
                </div>
                <Badge color={coach.isActive ? 'green' : 'gray'}>
                  {coach.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              </div>
              {coach.bio && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{coach.bio}</p>}
              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(coach)}>
                  {t('common.edit')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(coach)}>
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
        title={creating ? t('adminInstructors.addTitle') : t('adminInstructors.editTitle')}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label={t('adminInstructors.name')} required>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </FormField>
          <FormField label={t('adminInstructors.email')} required>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </FormField>
          <FormField label={t('adminInstructors.bio')}>
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label={t('adminInstructors.phone')}>
              <Input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </FormField>
            <FormField label={t('adminInstructors.photoUrl')}>
              <Input
                value={form.photoUrl}
                onChange={(e) => setForm((p) => ({ ...p, photoUrl: e.target.value }))}
              />
            </FormField>
          </div>
          <FormField label={t('adminInstructors.status')}>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              {t('adminInstructors.active')}
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
        title={t('adminInstructors.deleteTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600">
          {t('adminInstructors.deleteBody', { name: deleting?.name })}
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
