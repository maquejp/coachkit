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
import { fetchAllLocations, createLocation, updateLocation, deleteLocation } from '@/api/admin';
import type { Location } from '@/api/admin';

const emptyForm = {
  name: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  mapLink: '',
  isActive: true,
};

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState<Location | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Location | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const locs = await fetchAllLocations();
        if (!cancelled) setLocations(locs);
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

  function openEdit(loc: Location) {
    setForm({
      name: loc.name,
      address: loc.address,
      city: loc.city,
      phone: loc.phone,
      email: loc.email,
      mapLink: loc.mapLink ?? '',
      isActive: loc.isActive,
    });
    setEditing(loc);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateLocation(editing.id, {
          ...form,
          mapLink: form.mapLink || null,
        });
        setLocations((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        setEditing(null);
      } else {
        const created = await createLocation({
          ...form,
          mapLink: form.mapLink || null,
        });
        setLocations((prev) => [...prev, created]);
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
      await deleteLocation(deleting.id);
      setLocations((prev) => prev.filter((l) => l.id !== deleting.id));
      setDeleting(null);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner centered size="lg" />;

  return (
    <>
      <SEO title="Location Management" description="Manage studio locations." />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
          <p className="mt-1 text-gray-500">Manage studio locations and details.</p>
        </div>
        <Button onClick={openCreate}>Add Location</Button>
      </div>

      {locations.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-sm text-gray-400">No locations found.</div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
            <Card key={loc.id} hover>
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/admin/locations/${loc.id}`}
                    className="font-medium text-gray-900 hover:text-primary-600"
                  >
                    {loc.name}
                  </Link>
                  <p className="truncate text-xs text-gray-500">{loc.address}</p>
                </div>
                <Badge color={loc.isActive ? 'green' : 'gray'}>
                  {loc.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="mt-3 space-y-1 text-xs text-gray-500">
                <p>{loc.city}</p>
                <p>{loc.phone}</p>
                <p className="truncate">{loc.email}</p>
              </div>
              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                <Button size="sm" variant="outline" onClick={() => openEdit(loc)}>
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleting(loc)}>
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
        title={creating ? 'Add Location' : 'Edit Location'}
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
          <FormField label="Address" required>
            <Input
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="City" required>
              <Input
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Phone" required>
              <Input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                required
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email" required>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </FormField>
            <FormField label="Maps URL">
              <Input
                value={form.mapLink}
                onChange={(e) => setForm((p) => ({ ...p, mapLink: e.target.value }))}
                placeholder="https://maps.example.com/..."
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

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Location" size="sm">
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
