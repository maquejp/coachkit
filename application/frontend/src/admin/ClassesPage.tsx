import { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/ui/FormField';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { fetchAllClassTypes, createClassType, updateClassType, deleteClassType } from '@/api/admin';
import type { ClassType } from '@/api/admin';

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
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<ClassType | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ClassType | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const cts = await fetchAllClassTypes();
        if (!cancelled) setClassTypes(cts);
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
      if (editing) {
        const updated = await updateClassType(editing.id, form);
        setClassTypes((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setEditing(null);
      } else {
        const created = await createClassType(form);
        setClassTypes((prev) => [...prev, created]);
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
      await deleteClassType(deleting.id);
      setClassTypes((prev) => prev.filter((c) => c.id !== deleting.id));
      setDeleting(null);
    } finally {
      setSaving(false);
    }
  }

  function formatCents(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  if (loading) return <Spinner centered size="lg" />;

  return (
    <>
      <SEO title="Class Management" description="Manage class types." />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="mt-1 text-gray-500">Manage class types and pricing.</p>
        </div>
        <Button onClick={openCreate}>Add Class</Button>
      </div>

      {classTypes.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">No class types found.</div>
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
                  {ct.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{ct.description}</p>
              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                <span>Capacity: {ct.capacity}</span>
                <span>{formatCents(ct.defaultPriceCents)}</span>
              </div>
              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(ct)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(ct)}>
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
        title={creating ? 'Add Class Type' : 'Edit Class Type'}
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
          <FormField label="Description" required>
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Color" required>
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
            <FormField label="Duration (min)" required>
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
            <FormField label="Max Capacity" required>
              <Input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))}
                required
              />
            </FormField>
            <FormField label="Default Price ($)" required>
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
        title="Delete Class Type"
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
