import { useState } from 'react';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/auth';
import { updateProfileApi, changePasswordApi, deleteAccountApi } from '@/api/customer';
import type { CustomerUser } from '@/types';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [firstName, setFirstName] = useState((user as CustomerUser)?.firstName ?? '');
  const [lastName, setLastName] = useState((user as CustomerUser)?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState((user as CustomerUser)?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveProfile() {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateProfileApi({ firstName, lastName, email, phone });
      if (updated && user) {
        setAuth({ ...user, ...updated }, localStorage.getItem('auth_token') ?? '');
      }
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

  return (
    <>
      <SEO title="Profile" description="Manage your profile." />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-gray-500">Manage your account details and security.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card header={<span className="font-semibold text-gray-900">Personal Information</span>}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="first-name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="last-name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirm-password"
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
