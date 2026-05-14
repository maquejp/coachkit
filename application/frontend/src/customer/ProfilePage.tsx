import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/stores/auth';
import { updateProfileApi, changePasswordApi, deleteAccountApi } from '@/api/customer';
import type { CustomerUser } from '@/types';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { t, i18n } = useTranslation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [firstName, setFirstName] = useState((user as CustomerUser)?.firstName ?? '');
  const [lastName, setLastName] = useState((user as CustomerUser)?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState((user as CustomerUser)?.phone ?? '');
  const [language, setLanguage] = useState(user?.language ?? 'en');
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
      const updated = await updateProfileApi({ firstName, lastName, email, phone, language });
      if (updated && user) {
        setAuth({ ...user, ...updated }, localStorage.getItem('auth_token') ?? '');
        void i18n.changeLanguage(language);
      }
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    setPasswordError('');
    if (newPassword !== confirmPassword) {
      setPasswordError(t('customerProfile.errors.passwordMismatch'));
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(t('customerProfile.errors.passwordLength'));
      return;
    }
    setChangingPassword(true);
    try {
      await changePasswordApi(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError(t('customerProfile.errors.changeFailed'));
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
      <SEO
        title={t('seo.customerProfileTitle')}
        description={t('seo.customerProfileDescription')}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('customerProfile.heading')}</h1>
        <p className="mt-1 text-gray-500">{t('customerProfile.subtitle')}</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card
          header={
            <span className="font-semibold text-gray-900">{t('customerProfile.personalInfo')}</span>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                  {t('customerProfile.firstName')}
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
                  {t('customerProfile.lastName')}
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
                {t('customerProfile.email')}
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
                {t('customerProfile.phone')}
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="profile-language" className="block text-sm font-medium text-gray-700">
                {t('customerProfile.language')}
              </label>
              <select
                id="profile-language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <Button loading={saving} onClick={handleSaveProfile}>
                {t('common.saveChanges')}
              </Button>
              {saveSuccess && (
                <span className="text-sm text-green-600">{t('common.profileUpdated')}</span>
              )}
            </div>
          </div>
        </Card>

        <Card
          header={
            <span className="font-semibold text-gray-900">
              {t('customerProfile.changePassword')}
            </span>
          }
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                {t('common.currentPassword')}
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
                {t('common.newPassword')}
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
                {t('common.confirmNewPassword')}
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
              {t('common.updatePassword')}
            </Button>
          </div>
        </Card>

        <Card
          variant="bordered"
          className="border-red-200"
          header={
            <span className="font-semibold text-red-700">{t('customerProfile.dangerZone')}</span>
          }
        >
          <p className="mb-4 text-sm text-gray-600">{t('customerProfile.dangerWarning')}</p>
          <Button variant="accent" onClick={() => setShowDelete(true)}>
            {t('customerProfile.deleteAccount')}
          </Button>
        </Card>
      </div>

      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={t('customerProfile.deleteTitle')}
        size="sm"
      >
        <p className="text-sm text-gray-600">{t('customerProfile.deleteBody')}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDelete(false)}>
            {t('customerProfile.keepAccount')}
          </Button>
          <Button variant="accent" loading={deleting} onClick={handleDeleteAccount}>
            {t('common.yesDelete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
