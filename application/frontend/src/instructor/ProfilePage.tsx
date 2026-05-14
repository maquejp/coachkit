import { useEffect, useState } from 'react';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useAuthStore } from '@/stores/auth';
import { fetchInstructorProfile, updateInstructorProfile } from '@/api/instructor';
import { changePasswordApi, deleteAccountApi } from '@/api/customer';
import type { InstructorProfile as Profile } from '@/api/instructor';
import type { InstructorUser } from '@/types';

export default function InstructorProfilePage() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const coachId = (user as InstructorUser | null)?.coachId ?? null;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!coachId) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const p = await fetchInstructorProfile(coachId);
        if (!cancelled) {
          setProfile(p);
          setName(p.name);
          setBio(p.bio);
          setEmail(p.email);
          setPhone(p.phone ?? '');
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
  }, [coachId]);

  async function handleSaveProfile() {
    if (!coachId || !profile) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateInstructorProfile(coachId, {
        name,
        bio,
        phone: phone || null,
      });
      setProfile(updated);
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    setChangingPassword(true);
    try {
      await changePasswordApi(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await deleteAccountApi();
      clearAuth();
      window.location.href = '/';
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <Spinner centered size="lg" />;

  if (!profile) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Profile not found.</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="My Profile" description="Manage your instructor profile." />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-gray-500">Manage your profile details and security.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card header={<span className="font-semibold text-gray-900">Personal Information</span>}>
          <div className="space-y-4">
            <div>
              <label htmlFor="instructor-name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="instructor-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="instructor-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="instructor-email"
                type="email"
                value={email}
                disabled
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </div>
            <div>
              <label htmlFor="instructor-phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="instructor-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="instructor-bio" className="block text-sm font-medium text-gray-700">
                Biography
              </label>
              <textarea
                id="instructor-bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button loading={saving} onClick={handleSaveProfile}>
                Save Changes
              </Button>
              {saveSuccess && <span className="text-sm text-green-600">Profile updated.</span>}
            </div>
          </div>
        </Card>

        <Card header={<span className="font-semibold text-gray-900">Change Password</span>}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="instructor-current-password"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                id="instructor-current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label
                htmlFor="instructor-new-password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="instructor-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label
                htmlFor="instructor-confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                id="instructor-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
            <Button loading={changingPassword} onClick={handleChangePassword}>
              Update Password
            </Button>
          </div>
        </Card>

        <Card
          variant="bordered"
          className="border-red-200"
          header={<span className="font-semibold text-red-700">Danger Zone</span>}
        >
          <p className="mb-4 text-sm text-gray-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="accent" onClick={() => setShowDelete(true)}>
            Delete Account
          </Button>
        </Card>
      </div>

      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Account"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete your account? All your data will be permanently removed.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDelete(false)}>
            Keep Account
          </Button>
          <Button variant="accent" loading={deleting} onClick={handleDeleteAccount}>
            Yes, Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
