import { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { FormField } from '@/components/ui/FormField';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import {
  fetchSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  fetchPointCardPlans,
  createPointCardPlan,
  updatePointCardPlan,
  deletePointCardPlan,
} from '@/api/admin';
import type { SubscriptionPlan, PointCardPlan } from '@/api/admin';

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

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
  const [subPlans, setSubPlans] = useState<SubscriptionPlan[]>([]);
  const [pcPlans, setPcPlans] = useState<PointCardPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [creating, setCreating] = useState<'sub' | 'pc' | null>(null);
  const [editing, setEditing] = useState<SubscriptionPlan | PointCardPlan | null>(null);
  const [deleting, setDeleting] = useState<SubscriptionPlan | PointCardPlan | null>(null);

  const [subForm, setSubForm] = useState(emptySubForm);
  const [pcForm, setPcForm] = useState(emptyPcForm);
  const [featuresText, setFeaturesText] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [subs, pcs] = await Promise.all([fetchSubscriptionPlans(), fetchPointCardPlans()]);
        if (!cancelled) {
          setSubPlans(subs);
          setPcPlans(pcs);
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

  function openCreateSub() {
    setSubForm(emptySubForm);
    setFeaturesText('');
    setCreating('sub');
  }

  function openCreatePc() {
    setPcForm(emptyPcForm);
    setCreating('pc');
  }

  function openEditSub(p: SubscriptionPlan) {
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
    setEditing(p);
  }

  function openEditPc(p: PointCardPlan) {
    setPcForm({
      name: p.name,
      description: p.description,
      priceCents: p.priceCents,
      sessionsCount: p.sessionsCount,
      validityDays: p.validityDays,
      isActive: p.isActive,
    });
    setEditing(p);
  }

  async function handleSaveSub(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...subForm, features: featuresText.split('\n').filter(Boolean) };
      if (editing && 'interval' in editing) {
        const updated = await updateSubscriptionPlan(editing.id, payload);
        setSubPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditing(null);
      } else {
        const created = await createSubscriptionPlan(payload);
        setSubPlans((prev) => [...prev, created]);
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
      if (editing && 'sessionsCount' in editing) {
        const updated = await updatePointCardPlan(editing.id, pcForm);
        setPcPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setEditing(null);
      } else {
        const created = await createPointCardPlan(pcForm);
        setPcPlans((prev) => [...prev, created]);
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
      if ('interval' in deleting) {
        await deleteSubscriptionPlan(deleting.id);
        setSubPlans((prev) => prev.filter((p) => p.id !== deleting.id));
      } else {
        await deletePointCardPlan(deleting.id);
        setPcPlans((prev) => prev.filter((p) => p.id !== deleting.id));
      }
      setDeleting(null);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner centered size="lg" />;

  return (
    <>
      <SEO title="Pricing Management" description="Manage subscription and point card plans." />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
          <p className="mt-1 text-gray-500">Manage subscription plans and point card packs.</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Subscription Plans</h2>
          <Button onClick={openCreateSub}>Add Plan</Button>
        </div>
        {subPlans.length === 0 ? (
          <Card>
            <div className="py-8 text-center text-sm text-gray-400">No plans.</div>
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
                    {p.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {formatCents(p.priceCents)}
                  <span className="text-sm font-normal text-gray-500">/{p.interval}</span>
                </p>
                {p.trialDays > 0 && (
                  <p className="text-xs text-gray-500">{p.trialDays}-day trial</p>
                )}
                {p.features.length > 0 && (
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
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleting(p)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Point Card Packs</h2>
          <Button onClick={openCreatePc}>Add Pack</Button>
        </div>
        {pcPlans.length === 0 ? (
          <Card>
            <div className="py-8 text-center text-sm text-gray-400">No packs.</div>
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
                    {p.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatCents(p.priceCents)}</p>
                <p className="text-xs text-gray-500">
                  {p.sessionsCount} sessions · {p.validityDays} day validity
                </p>
                <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                  <Button size="sm" variant="outline" onClick={() => openEditPc(p)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleting(p)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={creating === 'sub' || (!!editing && 'interval' in editing)}
        onClose={() => {
          setCreating(null);
          setEditing(null);
        }}
        title={editing ? 'Edit Subscription Plan' : 'Add Subscription Plan'}
        size="md"
      >
        <form onSubmit={handleSaveSub} className="space-y-4">
          <FormField label="Name" required>
            <Input
              value={subForm.name}
              onChange={(e) => setSubForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Description" required>
            <Input
              value={subForm.description}
              onChange={(e) => setSubForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price ($)" required>
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
            <FormField label="Billing Interval" required>
              <Select
                value={subForm.interval}
                onChange={(e) =>
                  setSubForm((p) => ({ ...p, interval: e.target.value as 'monthly' | 'yearly' }))
                }
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Trial Days">
            <Input
              type="number"
              min={0}
              value={subForm.trialDays}
              onChange={(e) => setSubForm((p) => ({ ...p, trialDays: Number(e.target.value) }))}
            />
          </FormField>
          <FormField label="Features (one per line)">
            <textarea
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
              rows={4}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Unlimited classes&#10;Priority booking&#10;Free guest pass"
            />
          </FormField>
          <FormField label="Status">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={subForm.isActive}
                onChange={(e) => setSubForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Active
            </label>
          </FormField>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setCreating(null);
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
        open={creating === 'pc' || (!!editing && 'sessionsCount' in editing)}
        onClose={() => {
          setCreating(null);
          setEditing(null);
        }}
        title={editing ? 'Edit Point Card Pack' : 'Add Point Card Pack'}
        size="md"
      >
        <form onSubmit={handleSavePc} className="space-y-4">
          <FormField label="Name" required>
            <Input
              value={pcForm.name}
              onChange={(e) => setPcForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </FormField>
          <FormField label="Description" required>
            <Input
              value={pcForm.description}
              onChange={(e) => setPcForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price ($)" required>
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
            <FormField label="Sessions" required>
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
          <FormField label="Validity (days)" required>
            <Input
              type="number"
              min={1}
              value={pcForm.validityDays}
              onChange={(e) => setPcForm((p) => ({ ...p, validityDays: Number(e.target.value) }))}
              required
            />
          </FormField>
          <FormField label="Status">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={pcForm.isActive}
                onChange={(e) => setPcForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Active
            </label>
          </FormField>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setCreating(null);
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

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Plan" size="sm">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete <strong>{deleting?.name}</strong>? This cannot be undone.
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
