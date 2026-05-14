import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { fetchAllCoaches, createCoach, updateCoach, deleteCoach } from '@/api/admin';
import type { Coach } from '@/api/admin';

const emptyForm = {
  name: '',
  bio: '',
  email: '',
  phone: '',
  photoUrl: '',
  isActive: true,
};

export default function InstructorsPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<Coach | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Coach | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const cos = await fetchAllCoaches();
        if (!cancelled) setCoaches(cos);
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
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateCoach(editing.id, {
          ...form,
          phone: form.phone || null,
          photoUrl: form.photoUrl || null,
        });
        setCoaches((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setEditing(null);
      } else {
        const created = await createCoach({
          ...form,
          phone: form.phone || null,
          photoUrl: form.photoUrl || null,
        });
        setCoaches((prev) => [...prev, created]);
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
      await deleteCoach(deleting.id);
      setCoaches((prev) => prev.filter((c) => c.id !== deleting.id));
      setDeleting(null);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner centered size="lg" />;

  return (
    <>
      <SEO title="Instructor Management" description="Manage instructors." />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructors</h1>
          <p className="mt-1 text-gray-500">Manage instructors and their schedules.</p>
        </div>
        <Button onClick={openCreate}>Add Instructor</Button>
      </div>

      {coaches.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">No instructors found.</div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach) => (
            <Card key={coach.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                    {coach.name
                      .split(' ')
                      .map((s) => s[0])
                      .join('')}
                  </div>
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
                  {coach.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{coach.bio}</p>
              {coach.phone && <p className="mt-1 text-xs text-gray-400">{coach.phone}</p>}
              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(coach)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(coach)}>
                  Delete
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
        title={creating ? 'Add Instructor' : 'Edit Instructor'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Name" required>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Bio" required>
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email" required>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Phone">
              <Input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </FormField>
          </div>
          <FormField label="Photo URL">
            <Input
              value={form.photoUrl}
              onChange={(e) => setForm((p) => ({ ...p, photoUrl: e.target.value }))}
              placeholder="https://example.com/photo.jpg"
            />
          </FormField>
          <FormField label="Status">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Active
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
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Instructor"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{deleting?.name}</strong>? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleting(null)}>
            Keep
          </Button>
          <Button variant="accent" loading={saving} onClick={handleDelete}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
